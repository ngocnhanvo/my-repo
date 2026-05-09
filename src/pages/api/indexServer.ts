import type { APIRoute } from 'astro';
import type { WPProcessStep } from '../../entities/wordpress';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const loadEnv = () => {
  // Chỉ nạp nếu các biến WooCommerce cơ bản chưa được thiết lập
  if (process.env.WC_URL && process.env.WC_KEY && process.env.WC_SECRET) {
    return;
  }

  const possibleEnvPaths = [
    resolve(projectRoot, '.env'), // Chỉ tìm file .env chuẩn
    resolve(projectRoot, '.env.local'),
    resolve(projectRoot, '.env.development'),
  ];

  let envFilePath = '';
  for (const path of possibleEnvPaths) {
    if (existsSync(path)) {
      envFilePath = path;
      break;
    }
  }

  if (!envFilePath) {
    console.warn('[API/ACF] No .env file found at expected paths.');
    return;
  }

  try {
    const envFile = readFileSync(envFilePath, 'utf-8');
    console.log(`[API/ACF] Successfully read env from: ${envFilePath}`);
    for (const line of envFile.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim();
      // Only set if the variable is not already defined in process.env
      if (process.env[key] === undefined) {
        process.env[key] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      }
    }
  } catch {
    // Ignore missing .env file; fail later if env vars are required.
  }
};

loadEnv();

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;
// Tự động tạo COCART_URL từ WC_URL để không phụ thuộc vào file .env

const DEFAULT_WOO_IMAGE = 'https://static.wixstatic.com/media/73be94_97c40b507e5c4d8a85419190f7952003~mv2.png?originWidth=448&originHeight=384';

const percentEncode = (value: string) =>
  encodeURIComponent(value)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');

const createOAuthSignature = (method: string, baseUrl: string, params: URLSearchParams) => {
  const sortedParams = [...params.entries()].sort((a, b) => {
    if (a[0] === b[0]) return a[1].localeCompare(b[1]);
    return a[0].localeCompare(b[0]);
  });

  const paramString = sortedParams
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join('&');

  const baseString = [
    method.toUpperCase(), // Đảm bảo method là chữ hoa cho chữ ký
    percentEncode(baseUrl),
    percentEncode(paramString),
  ].join('&');

  const signingKey = `${percentEncode(WC_SECRET ?? '')}&`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
};

const getWooEndpoint = (path: string, searchParams?: URLSearchParams) => {
  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    throw new Error('WooCommerce env vars WC_URL, WC_KEY, and WC_SECRET are required');
  }

  const url = new URL(path, WC_URL);
  const params = new URLSearchParams(searchParams?.toString() ?? '');
  params.set('per_page', '100');

  const oauthParams = new URLSearchParams({
    oauth_consumer_key: WC_KEY,
    oauth_nonce: Math.random().toString(36).slice(2, 12),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: '1.0',
  });

  for (const [key, value] of params.entries()) { // Thêm các tham số tìm kiếm khác vào oauthParams
    oauthParams.set(key, value);
  }

  const signature = createOAuthSignature('GET', url.origin + url.pathname, oauthParams);
  oauthParams.set('oauth_signature', signature);

  return `${url.origin}${url.pathname}?${oauthParams.toString()}`;
};

const stripHtml = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]+>/g, '').trim();
};

/**
 * Ánh xạ dữ liệu thô từ WordPress Process Step sang thực thể WPProcessStep
 */
const mapWpProcessStepToEntity = (item: any): WPProcessStep => {
  const imageUrl = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  let absoluteImageUrl = imageUrl || '';

  // Chuyển đổi đường dẫn tương đối thành tuyệt đối nếu cần thiết dựa trên WC_URL
  if (absoluteImageUrl.startsWith('/') && WC_URL) {
    absoluteImageUrl = `${WC_URL.replace(/\/$/, '')}${absoluteImageUrl}`;
  }

  return {
    id: item.id,
    title: item.title?.rendered || '',
    description: stripHtml(item.content?.rendered || ''),
    order: Number(item.acf?.order) || 0,
    benefit: item.acf?.benefit || '',
    image: absoluteImageUrl,
  };
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const _embed = url.searchParams.get('_embed');
    const id = url.searchParams.get('id');
    if (!type) {
      return new Response(JSON.stringify({ error: 'Thiếu tham số "type"' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const searchParams = new URLSearchParams();
    searchParams.set('_embed', _embed || 'true'); // Luôn nhúng dữ liệu media
    searchParams.set('per_page', '100');

    let endpointPath = `/wp-json/wp/v2/${type}`;
    if (id) endpointPath += `/${id}`;
    const response = await fetch(getWooEndpoint(endpointPath, searchParams));
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Không thể tải dữ liệu ${type} từ WordPress` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    if (id) {
      return new Response(JSON.stringify(mapWpProcessStepToEntity(data)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const items = Array.isArray(data) ? data.map(mapWpProcessStepToEntity) : [];
    
    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Lỗi máy chủ' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

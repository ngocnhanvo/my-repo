import { WPInfo } from '@/entities/wordpress';
import { resolvePlaceholders } from '../stringUtils';
const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getPrivacyPage(infoData: WPInfo) { // Renamed function to match file name
  if (!WC_URL) {
    console.error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables.');
    return { title: '', content: '', en_title: '', en_content: '' };
  }

  try {
    // Fetch trang chính sách bảo mật tiếng Việt
    const viResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=privacy-policy&_embed=true&status=publish`);
    const viPages = viResponse.ok ? await viResponse.json() : [];
    const viPage = viPages.length > 0 ? viPages[0] : null;

    // Fetch trang chính sách bảo mật tiếng Anh
    const enResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=en_privacy-policy&_embed=true&status=publish`);
    const enPages = enResponse.ok ? await enResponse.json() : [];
    const enPage = enPages.length > 0 ? enPages[0] : null;

    return {
      // Nội dung tiếng Việt
      title: resolvePlaceholders(viPage?.title?.rendered || '', infoData),
      content: resolvePlaceholders(viPage?.content?.rendered || '', infoData),
      // Nội dung tiếng Anh (từ trang riêng)
      en_title: resolvePlaceholders(enPage?.title?.rendered || '', infoData),
      en_content: resolvePlaceholders(enPage?.content?.rendered || '', infoData),
    };
  } catch (error) {
    console.error(`❌ LỖI fetch Privacy Policy:`, error);
    // Trả về đối tượng rỗng để tránh lỗi undefined trong các component React
    return { title: '', content: '', en_title: '', en_content: '' };
  }
}
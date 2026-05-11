// Sửa lại imageProcessor.ts
interface ProcessImageOptions {
  imageUrl: string;
  wcUrl?: string;
  publicDirBase?: string;
}

export async function processAndStoreImage({
  imageUrl,
  wcUrl,
  publicDirBase = 'images',
}: ProcessImageOptions): Promise<string> {
  if (!imageUrl) return '';

  // KIỂM TRA MÔI TRƯỜNG: Chỉ chạy code này nếu là Server (SSR)
  if (import.meta.env.SSR || typeof window === 'undefined') {
    // Import động các thư viện Node.js bên trong hàm
    const { writeFileSync, mkdirSync, existsSync } = await import('node:fs');
    const path = await import('node:path');

    let absoluteImageUrl = imageUrl;
    if (absoluteImageUrl.startsWith('/') && wcUrl) {
      absoluteImageUrl = `${wcUrl.replace(/\/$/, '')}${absoluteImageUrl}`;
    }

    const filename = absoluteImageUrl.split('/').pop()?.split('?')[0];
    if (!filename) return absoluteImageUrl;

    const publicDir = path.resolve('public', publicDirBase);
    const localPath = path.join(publicDir, filename);
    const publicUrl = `/${publicDirBase}/${filename}`;

    try {
      if (!existsSync(publicDir)) {
        mkdirSync(publicDir, { recursive: true });
      }

      if (existsSync(localPath)) {
        return publicUrl;
      }

      const res = await fetch(absoluteImageUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        writeFileSync(localPath, Buffer.from(buffer));
        return publicUrl;
      }
    } catch (err) {
      console.error(`Lỗi Server-side xử lý ảnh:`, err);
    }
  }

  // Trả về URL gốc nếu đang chạy ở Client hoặc gặp lỗi
  return imageUrl;
}
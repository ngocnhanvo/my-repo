// Sửa lại imageProcessor.ts
interface ProcessImageOptions {
  imageUrl: string;
  wcUrl?: string;
  publicDirBase?: string;
  isPreview?: boolean; // Thêm tham số này để kiểm tra chế độ preview
}

export async function processAndStoreImage({
  imageUrl,
  wcUrl,
  publicDirBase = 'images',
  isPreview = false, // Mặc định là false
}: ProcessImageOptions): Promise<string> {
  if (!imageUrl) return '';

  // Nếu đang ở chế độ preview, không cần xử lý ảnh, chỉ trả về URL gốc
  if (isPreview) {
    return imageUrl;
  }

  // KIỂM TRA MÔI TRƯỜNG: Chỉ chạy code này nếu là Server (SSR)
  if (import.meta.env.SSR || typeof window === 'undefined') {
    // Import động các thư viện Node.js bên trong hàm
    const { writeFileSync, mkdirSync, existsSync } = await import('node:fs');
    const path = await import('node:path');
    const sharp = (await import('sharp')).default;
    let absoluteImageUrl = imageUrl;
    if (absoluteImageUrl.startsWith('/') && wcUrl) {
      absoluteImageUrl = `${wcUrl.replace(/\/$/, '')}${absoluteImageUrl}`;
    }

    const originalFilename = absoluteImageUrl.split('/').pop()?.split('?')[0];
    if (!originalFilename) return absoluteImageUrl;

    const ext = path.extname(originalFilename);
    const nameWithoutExt = path.basename(originalFilename, ext);
    const webpFilename = `${nameWithoutExt}.webp`;

    const publicDir = path.resolve('public', publicDirBase);
    const originalLocalPath = path.join(publicDir, originalFilename);
    const webpLocalPath = path.join(publicDir, webpFilename);
    const publicUrl = `/${publicDirBase}/${originalFilename}`;
    try {
      if (!existsSync(publicDir)) {
        mkdirSync(publicDir, { recursive: true });
      }

      const res = await fetch(absoluteImageUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const nodeBuffer = Buffer.from(buffer);

        // Lưu ảnh gốc
        if (!existsSync(originalLocalPath)) {
          writeFileSync(originalLocalPath, nodeBuffer);
        }

        // Tạo và lưu ảnh WebP
        if (!existsSync(webpLocalPath)) {
          await sharp(nodeBuffer)
            .webp({ quality: 80 })
            .toFile(webpLocalPath);
        }

        return publicUrl;
      }
    } catch (err) {
      console.error(`Lỗi Server-side xử lý ảnh:`, err);
    }
  }

  // Trả về URL gốc nếu đang chạy ở Client hoặc gặp lỗi
  return imageUrl;
}
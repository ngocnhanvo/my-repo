// src/lib/wordpress.ts
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getProcessSteps() {
  const response = await fetch(
    `${WC_URL}/wp-json/wp/v2/process_steps?_embed=true&v=${Date.now()}`,
    { cache: 'no-store' }
  );
  
  const raw_data = await response.json();

  return await Promise.all(raw_data.map(async (step: any) => {
    const media = step._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = media?.source_url;
    let absoluteImageUrl = imageUrl || '';

    if (absoluteImageUrl.startsWith('/') && WC_URL) {
      absoluteImageUrl = `${WC_URL.replace(/\/$/, '')}${absoluteImageUrl}`;
    }

    if (absoluteImageUrl) {
      const filename = absoluteImageUrl.split('/').pop();
      // LƯU Ý: Nên dùng thư mục public/images để Astro tự quản lý khi build
      const publicDir = path.resolve('public/images');
      const localPath = path.join(publicDir, filename);
      const publicUrl = `/images/${filename}`;

      try {
        if (!existsSync(publicDir)) {
          mkdirSync(publicDir, { recursive: true });
        }
        const res = await fetch(absoluteImageUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          writeFileSync(localPath, Buffer.from(buffer));
        }
      } 
      catch (err) {
      
      }
    }

    return {
      id: step.id,
      tieudechinh: step.acf.tieudechinh || '',
      en_tieudechinh: step.acf.en_tieudechinh || '',
      mota: step.acf.mota || '',
      en_mota: step.acf.en_mota || '',
      benefit: step.acf.benefit || '',
      en_benefit: step.acf.en_benefit || '',
      order: step.acf.order || 0,
      image: absoluteImageUrl
    };
  }));
}
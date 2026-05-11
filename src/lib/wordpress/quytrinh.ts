import { processAndStoreImage } from './imageProcessor'; // Import the new utility function

const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getProcessSteps() {
  if (!WC_URL) {
    console.error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables.');
    return [];
  }

  let raw_data = [];
  try {
    const response = await fetch(
      `${WC_URL}/wp-json/wp/v2/process_steps?_embed=true&v=${Date.now()}`,
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error(`Server trả về lỗi: ${response.status}`);
    raw_data = await response.json();
  } catch (error) {
    console.error(`❌ LỖI kết nối WordPress (${WC_URL}):`, error instanceof Error ? error.message : error);
    // Trả về mảng rỗng thay vì làm sập toàn bộ quá trình build nếu bạn muốn build tiếp
    return []; 
  }

  return await Promise.all(raw_data.map(async (step: any) => {
    const media = step._embedded?.['wp:featuredmedia']?.[0];
    const imageUrl = media?.source_url;
    let absoluteImageUrl = imageUrl || '';
    
    const finalImageUrl = await processAndStoreImage({
      imageUrl: absoluteImageUrl,
      wcUrl: WC_URL,
      publicDirBase: 'images/quytrinh', // Lưu ảnh quy trình vào thư mục riêng
    });

    return {
      id: step.id,
      tieudechinh: step.acf.tieudechinh || '',
      en_tieudechinh: step.acf.en_tieudechinh || '',
      mota: step.acf.mota || '',
      en_mota: step.acf.en_mota || '',
      benefit: step.acf.benefit || '',
      en_benefit: step.acf.en_benefit || '',
      order: step.acf.order || 0,
      image: finalImageUrl
    };
  }));
}
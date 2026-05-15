// src/lib/wordpress.ts
const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getCompre(status: string = 'publish') {
  if (!WC_URL) {
    console.error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables.');
    return [];
  }

  let raw_data = [];
  try {
    const response = await fetch(
      `${WC_URL}/wp-json/wp/v2/so-sanh?_embed=true&status=${status}&v=${Date.now()}`,
    );
    if (!response.ok) throw new Error(`Server trả về lỗi: ${response.status}`);
    raw_data = await response.json();
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ LỖI kết nối WordPress (${WC_URL}):`, errorMessage);
    // Trả về mảng rỗng thay vì làm sập toàn bộ quá trình build nếu bạn muốn build tiếp
    return []; 
  }

  return await Promise.all(raw_data.map(async (item: any) => {
    item.thongsokythuat = item.acf.thongsokythuat || '';
    item.en_thongsokythuat = item.acf.en_thongsokythuat || '';
    item.chungtoi = item.acf.chungtoi || '';
    item.en_chungtoi = item.acf.en_chungtoi || '';
    item.wix_0 = item.acf.wix_0 || '';
    item.en_wix_0 = item.acf.en_wix_0 || '';
    item.order = item.acf.order || 0;
    return item;
  }));
}
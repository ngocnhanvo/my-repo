// src/lib/wordpress.ts
const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getCompre() {
  const response = await fetch(
    `${WC_URL}/wp-json/wp/v2/so-sanh?_embed=true&v=${Date.now()}`,
    { cache: 'no-store' }
  );
  
  const raw_data = await response.json();

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
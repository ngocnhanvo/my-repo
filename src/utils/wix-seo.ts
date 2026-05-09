// src/utils/wix-seo.ts
export async function getWixSeoConfig(pageUrl: string, title: string) {
  // TUYỆT CHIÊU: Chỉ import khi thực sự không ở trong môi trường Node.js Loader
  // Hoặc khi đang chạy thực tế trên Cloudflare
  try {
    // Dùng dynamic import với chuỗi biến đổi để lách bộ quét tĩnh
    const servicePath = '@wix/seo/services';
    const { loadSEOTagsServiceConfig } = await import(servicePath);
    
    return await loadSEOTagsServiceConfig({
      pageUrl,
      itemData: { pageName: title || 'Home' },
    });
  } catch (e) {
    // Trả về config rỗng nếu gặp lỗi protocol ở máy local
    return { tags: [] };
  }
}
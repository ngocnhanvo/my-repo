const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getProducts() {
  if (!WC_URL) {
    throw new Error('❌ LỖI: Biến WC_URL chưa được cấu hình. Không thể fetch sản phẩm.');
  }

  try {
    // Fetch danh sách sản phẩm (Custom Post Type: product)
    // Sử dụng _embed để lấy thêm ảnh đại diện (featured media)
    const response = await fetch(`${WC_URL}/wp-json/wp/v2/product?_embed=true&per_page=100`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ LỖI fetch sản phẩm: ${response.status} - ${errorText}`);
    }

    const products = await response.json();

    // Logic gom nhóm sản phẩm theo slug (bỏ tiền tố en_)
    const unifiedProducts: Record<string, any> = {};

    products.forEach((item: any) => {
      const isEn = item.slug.startsWith('en_');
      const baseSlug = isEn ? item.slug.replace('en_', '') : item.slug;

      if (!unifiedProducts[baseSlug]) {
        unifiedProducts[baseSlug] = {
          id: item.id,
          baseSlug: baseSlug,
          // Dùng slug không có tiền tố làm key định danh chính trên URL
          slug: baseSlug, 
          image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          price: item.price || '',
          description: item.acf?.description || '',
          // Khởi tạo các trường nội dung
          title: '', content: '', en_title: '', en_content: ''
        };
      }

      const p = unifiedProducts[baseSlug];
      if (isEn) {
        p.en_title = item.title?.rendered || '';
        p.en_content = item.content?.rendered || '';
      } else {
        p.title = item.title?.rendered || '';
        p.content = item.content?.rendered || '';
        // Ưu tiên lấy ảnh và thông tin từ bản tiếng Việt nếu có cả 2
        p.image = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.image;
        p.price = item.price || p.price;
      }
    });

    return Object.values(unifiedProducts);

  } catch (error) {
    console.error(`❌ LỖI nghiêm trọng khi fetch sản phẩm:`, error);
    throw error;
  }
}

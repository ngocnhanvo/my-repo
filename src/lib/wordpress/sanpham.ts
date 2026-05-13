const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getProducts() {
  if (!WC_URL) {
    throw new Error('❌ LỖI: Biến WC_URL chưa được cấu hình. Không thể fetch sản phẩm.');
  }

  try {
    // Fetch danh sách sản phẩm (Custom Post Type: product)
    // Sử dụng _embed để lấy thêm ảnh đại diện (featured media)
    const response = await fetch(`${WC_URL}/wp-json/wp/v2/product?_embed=true&per_page=100&orderby=menu_order&order=asc`);
    
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
      const featuredImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

      if (!unifiedProducts[baseSlug]) {
        unifiedProducts[baseSlug] = {
          id: item.id,
          baseSlug: baseSlug,
          slug: baseSlug, 
          image: '',
          price: '',
          description: '',
          title: '', 
          content: '', 
          en_title: '', 
          en_content: ''
        };
      }

      const p = unifiedProducts[baseSlug];
      
      if (isEn) {
        p.en_title = item.title?.rendered || '';
        p.en_content = item.content?.rendered || '';
        // Nếu chưa có ảnh/giá/mô tả (do chưa xử lý bản chính), lấy tạm từ bản EN
        if (!p.image) p.image = featuredImage;
        if (!p.price) p.price = item.acf?.price || item.price || '';
        if (!p.description) p.description = item.acf?.description || '';
      } else {
        p.title = item.title?.rendered || '';
        p.content = item.content?.rendered || '';
        // Ưu tiên ghi đè bằng thông tin từ bản không có tiền tố (bản chính)
        if (featuredImage) p.image = featuredImage;
        const mainPrice = item.acf?.price || item.price;
        if (mainPrice) p.price = mainPrice;
        if (item.acf?.description) p.description = item.acf.description;
      }
    });

    return Object.values(unifiedProducts);

  } catch (error) {
    console.error(`❌ LỖI nghiêm trọng khi fetch sản phẩm:`, error);
    throw error;
  }
}

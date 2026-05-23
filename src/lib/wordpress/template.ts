import { WPTemplate } from '@/entities';
import { processAndStoreImage } from './imageProcessor';
const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getTemplates(status: string = 'publish', isPreview: boolean = false): Promise<WPTemplate[]>{
  if (!WC_URL) {
    throw new Error('❌ LỖI: Biến WC_URL chưa được cấu hình. Không thể fetch sản phẩm.');
  }

  try {
    // Fetch danh sách sản phẩm (Custom Post Type: product)
    // Sử dụng _embed để lấy thêm ảnh đại diện (featured media)
    const response = await fetch(`${WC_URL}/wp-json/wp/v2/product?_embed=true&per_page=100&orderby=menu_order&order=asc&product_cat_slug=template&status=${status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ LỖI fetch template: ${response.status} - ${errorText}`);
    }

    const templates = await response.json();

    // Logic gom nhóm sản phẩm theo slug (bỏ tiền tố en_)
    let unifiedTemplates: WPTemplate[] = [];

    templates.forEach((item: any) => {
      // Xác định ID gốc: Nếu có origin_product_id thì dùng nó, nếu không thì dùng chính ID của item (bản tiếng Việt)
      const originKey = (item.acf?.origin_product_id || item.id).toString();
      const featuredImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      const lang = item.acf?.product_lang?.value || 'vi'; // Mặc định là tiếng Việt nếu không có trường này
      let itemcp = unifiedTemplates.find((t) => t.id === originKey);
      const packageType = item.attributes?.find((attr: any) => attr.slug === 'pa_packagetype').options?.[0] || '';
      const url = item.attributes?.find((attr: any) => attr.slug === 'pa_url').options?.[0] || '';
      const price = item.price || 'Liên hệ';
      const currency = item.acf?.currency?.label || '';
      if (itemcp == null) {
        itemcp = {
          id: originKey,
          slug: { [lang]: item.slug },
          image: { [lang]: featuredImage},
          url: {[lang]: url},
          description: '',
          title: { [lang]: item.title?.rendered || '' },
          content: { [lang]: item.content?.rendered || '' },
          packageType: {[lang]: packageType},
          price: {[lang]: {price: price, currency: currency}},
          category: ''
        };
        unifiedTemplates.push(itemcp);
      }
      else {
        itemcp.slug = { ...itemcp.slug, [lang]: item.slug };
        itemcp.title = { ...itemcp.title, [lang]: item.title?.rendered || '' };
        itemcp.content = { ...itemcp.content, [lang]: item.content?.rendered || '' };
        itemcp.packageType = { ...itemcp.packageType, [lang]: packageType };
        itemcp.image = { ...itemcp.image, [lang]: featuredImage };
        itemcp.price = { ...itemcp.price, [lang]: {price: price, currency: currency}};
        itemcp.url = { ...itemcp.url, [lang]: url };
      }
    });
    // Xử lý lưu ảnh static cho tất cả template đã gom nhóm
    return await Promise.all(Object.values(unifiedTemplates).map(async (p: any): Promise<WPTemplate> => {
      if (p.image) {
        for (const id of Object.keys(p.image)) {
          const store = await processAndStoreImage({
            imageUrl: p.image[id],
            wcUrl: WC_URL,
            publicDirBase: 'images/templates', // Lưu vào thư mục riêng cho sản phẩm
            isPreview: isPreview, // Truyền trạng thái preview
          });
          p.image[id] = store;
        }
      }
      return p;
    }));

  } catch (error) {
    console.error(`❌ LỖI nghiêm trọng khi fetch template:`, error);
    throw error;
  }
}

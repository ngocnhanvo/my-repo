import { processAndStoreImage } from './imageProcessor'; // Import the new utility function
// import { generateAndSaveSitemap } from './sitemap'; // Removed as sitemap is generated in Astro

const WC_URL = import.meta.env.WC_URL || process.env.WC_URL; // Keep WC_URL
export const content = {
    vi: {
      nav: {
        home: 'Trang Chủ',
        products: 'Sản Phẩm',
        about: 'Giới Thiệu',
        contact: 'Liên Hệ'
      },
      hero: {
        title1: 'Tốc Độ AI',
        title2: 'Chất Lượng Developer',
        subtitle: 'Xây dựng website chuyên nghiệp với sức mạnh AI và tay nghề chuyên gia',
        description: 'Hệ thống rèn đúc kỹ thuật số kết hợp công nghệ AI tiên tiến với kinh nghiệm phát triển web chuyên sâu. Tạo ra những nền tảng vượt trội về hiệu suất và thẩm mỹ.',
        cta: 'Khởi Động Dự Án',
        ctaSecondary: 'Khám Phá Hệ Thống'
      },
      process: {
        title: 'Quy Trình Vận Hành',
        subtitle: 'Kiến trúc 3 giai đoạn tối ưu hóa từ ý tưởng đến triển khai thực tế.'
      },
      comparison: {
        title: 'Phân Tích Hiệu Suất',
        subtitle: 'Đánh giá năng lực cốt lõi: Chúng tôi vs Nền tảng tiêu chuẩn',
        feature: 'Tiêu chí so sánh',
        vibeStudio: 'Chúng tôi',
        standardWix: 'Nền tảng tiêu chuẩn'
      },
      pricing: {
        title: 'Gói Triển Khai',
        subtitle: 'Đa dạng cho nhiều quy mô doanh nghiệp',
        from: 'Khởi điểm từ',
        currency: 'VNĐ',
        contact: 'Tìm hiểu thêm'
      },
      contact: {
        title: 'Kết Nối Hệ Thống',
        subtitle: 'Trung tâm điều hành tại TP. Hồ Chí Minh - Sẵn sàng phục vụ bạn',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        email: 'contact@vibecodestudio.com',
        phone: '+84 123 456 789',
        cta: 'Truyền Tín Hiệu'
      }
    },
    en: {
      nav: {
        home: 'Home',
        products: 'Products',
        about: 'About',
        contact: 'Contact'
      },
      hero: {
        title1: 'AI Velocity',
        title2: 'Developer Precision',
        subtitle: 'Build professional websites with AI power and expert craftsmanship',
        description: 'A digital forge combining cutting-edge AI technology with deep web development expertise. Creating platforms that excel in performance and aesthetics.',
        cta: 'Initialize Project',
        ctaSecondary: 'Explore System'
      },
      process: {
        title: 'Operational Workflow',
        subtitle: 'A 3-stage architecture optimized from concept to deployment.'
      },
      comparison: {
        title: 'Performance Analysis',
        subtitle: 'Core capability assessment: Us vs Standard platforms',
        feature: 'Comparative criteria',
        vibeStudio: 'Us',
        standardWix: 'Standard platforms'
      },
      pricing: {
        title: 'Deployment Plans',
        subtitle: 'Versatile solutions for any business size',
        from: 'Starting at',
        currency: 'VND',
        contact: 'Learn More'
      },
      contact: {
        title: 'System Connection',
        subtitle: 'Command center in Ho Chi Minh City - Ready for global deployment',
        location: 'Ho Chi Minh City, Vietnam',
        email: 'contact@vibecodestudio.com',
        phone: '+84 123 456 789',
        cta: 'Transmit Signal'
      }
    }
  };

export async function getInfo() {
  if (!WC_URL) {
    throw new Error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables. Không thể fetch thông tin chung.');
  }

  try {
    const response = await fetch(
      `${WC_URL}/wp-json/wp/v2/thong-tin-chung?_embed=true&status=publish&v=${Date.now()}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ LỖI fetch thông tin chung từ CMS: ${response.status} ${response.statusText} - ${errorText}`);
    }
  
  const raw_data = await response.json();

  return await Promise.all(raw_data.map(async (item: any) => {
    const logoUrl = item.acf.logo?.url || '';
    const faviconUrl = item.acf.favicon?.url || '';
    const imageUrl = item.acf.image?.url || '';

    const processedLogoUrl = await processAndStoreImage({
      imageUrl: logoUrl,
      wcUrl: WC_URL,
      publicDirBase: 'images/info', // Lưu ảnh logo/favicon vào thư mục riêng
    });
    const processedFaviconUrl = await processAndStoreImage({
      imageUrl: faviconUrl,
      wcUrl: WC_URL,
      publicDirBase: 'images/info', // Lưu ảnh logo/favicon vào thư mục riêng
    });
    const processedImageUrl = await processAndStoreImage({
      imageUrl: imageUrl,
      wcUrl: WC_URL,
      publicDirBase: 'images/info', // Lưu ảnh logo/favicon vào thư mục riêng
    });

    return {
      ...item, // Giữ lại các thuộc tính gốc
      tencongty: item.acf.tencongty || '',
      en_tencongty: item.acf.en_tencongty || '',
      diachi: item.acf.diachi || '',
      en_diachi: item.acf.en_diachi || '',
      sodienthoai: item.acf.sodienthoai || '',
      email: item.acf.email || '',
      domain: item.acf.domain || '',
      logo: processedLogoUrl,
      favicon: processedFaviconUrl,
      image: processedImageUrl,
      order: item.acf.order || 0
    };
  }));

  } catch (error) {
    console.error(`❌ LỖI nghiêm trọng khi fetch thông tin chung từ CMS:`, error);
    throw error; // Re-throw to fail the build
  }
}
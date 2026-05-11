import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo } from '@/entities'; // Removed unused imports
import { useOutletContext } from 'react-router-dom';

interface PrivacyPageProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
  data_privacy?: any; // Keep data_privacy as it's used
}

interface OutletContextType {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

export default function PrivacyPage({ data_info, data_privacy }: PrivacyPageProps) {
  const { language, setLanguage } = useOutletContext<OutletContextType>();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  // Ưu tiên dùng dữ liệu từ WordPress, nếu không có mới dùng fallback
  const wpTitle = language === 'en' ? (data_privacy?.en_title || data_privacy?.title) : data_privacy?.title;
  const wpContent = language === 'en' ? (data_privacy?.en_content || data_privacy?.content) : data_privacy?.content;

  const content = {
    vi: {
      title: wpTitle || 'Chính Sách Bảo Mật',
      sections: [
        { 
            title: '1. Giới thiệu', 
            content: `Chào mừng quý khách đến với Vibe Code NVN.
            Chúng tôi cung cấp dịch vụ thiết kế website, triển khai giao diện hiện đại, tối ưu hiệu suất và tích hợp hệ thống quản trị nội dung (CMS) theo nhu cầu doanh nghiệp.

            Việc sử dụng dịch vụ của Vibe Code NVN đồng nghĩa với việc khách hàng đồng ý với các điều khoản và chính sách dưới đây.` 
        },
        { 
            title: '2. Phạm vi dịch vụ', 
            content: `
            Vibe Code NVN cung cấp các dịch vụ bao gồm nhưng không giới hạn:

            Thiết kế website doanh nghiệp
            Thiết kế landing page
            Chuyển đổi giao diện từ nền tảng khác sang website riêng
            Xây dựng website bằng Astro, React, WordPress Headless
            Tích hợp CMS quản trị nội dung
            Tối ưu tốc độ tải trang và SEO cơ bản
            Bảo trì và hỗ trợ kỹ thuật
            Hosting, domain và triển khai Cloudflare (nếu khách hàng yêu cầu)
            ` }
      ]
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        { title: '1. Information Collection', content: 'We collect information to provide better services to our users.' },
        { title: '2. Use of Information', content: 'Your information is used to optimize experience and provide technical support.' }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/30 selection:text-primary">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />
      
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-primary">{t.title}</h1>
          <div className="space-y-12 article-content">
            {wpContent ? (
              <div className="prose prose-invert max-w-none text-foreground/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: wpContent }} />
            ) : (
              t.sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  <p className="text-foreground/70 leading-relaxed">{section.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />
    </div>
  );
}
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo } from '@/entities'; // Removed unused imports
import { useOutletContext } from 'react-router-dom';

interface TermsPageProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
  data_terms?: any; // Keep data_terms as it's used
}

interface OutletContextType {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

export default function TermsPage({ data_info, data_terms }: TermsPageProps) {
  const { language, setLanguage } = useOutletContext<OutletContextType>();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  // Lấy nội dung từ WordPress theo ngôn ngữ
  const wpTitle = language === 'en' ? (data_terms?.en_title || data_terms?.title) : data_terms?.title;
  const wpContent = language === 'en' ? (data_terms?.en_content || data_terms?.content) : data_terms?.content;

  const content = {
    vi: {
      title: wpTitle || 'Điều Khoản Dịch Vụ',
      sections: [
        { title: '1. Điều khoản chung', content: 'Bằng việc truy cập hệ thống, bạn đồng ý tuân thủ các điều khoản dịch vụ của chúng tôi.' },
        { title: '2. Trách nhiệm người dùng', content: 'Người dùng có trách nhiệm bảo mật thông tin tài khoản và sử dụng hệ thống đúng mục đích.' }
      ]
    },
    en: {
      title: wpTitle || 'Terms of Service',
      sections: [
        { title: '1. General Terms', content: 'By accessing the system, you agree to comply with our terms of service.' },
        { title: '2. User Responsibility', content: 'Users are responsible for account security and using the system for its intended purpose.' }
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
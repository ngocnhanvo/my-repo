import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo, WPProcessStep, WPComparison } from '@/entities';
import { useOutletContext } from 'react-router-dom';
import { resolvePlaceholders } from '@/lib/stringUtils';

interface AboutPageProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
  data_about_me?: any; 
}

interface OutletContextType {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

export default function AboutPage({ data_info, data_about_me }: AboutPageProps) {
  const { language, setLanguage } = useOutletContext<OutletContextType>();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  const wpTitle = resolvePlaceholders(language === 'en' ? data_about_me?.en_title : data_about_me?.title, infoData);
  const wpContent = resolvePlaceholders(language === 'en' ? data_about_me?.en_content : data_about_me?.content, infoData);

  const contentFallback = {
    vi: {
      title: 'Giới Thiệu',
      sections: [
        { 
            title: 'Về Vibe Code NVN', 
            content: `Chúng tôi là đơn vị tiên phong trong việc kết hợp trí tuệ nhân tạo (AI) vào quy trình phát triển website hiện đại. 
            Với đội ngũ kỹ sư dày dạn kinh nghiệm, chúng tôi không chỉ tạo ra những trang web có giao diện đẹp mắt mà còn tối ưu hóa hiệu suất và trải nghiệm người dùng ở mức cao nhất.` 
        },
        { 
            title: 'Tầm nhìn của chúng tôi', 
            content: `Trở thành đối tác công nghệ tin cậy, giúp các doanh nghiệp số hóa quy trình và khẳng định vị thế trên không gian mạng thông qua các giải pháp kỹ thuật số đột phá.` 
        }
      ]
    },
    en: {
      title: 'About Us',
      sections: [
        { 
            title: 'About Vibe Code NVN', 
            content: 'We are pioneers in integrating Artificial Intelligence (AI) into modern website development workflows. With a team of experienced engineers, we create not just beautiful interfaces but also highly optimized performance and user experiences.' 
        },
        { 
            title: 'Our Vision', 
            content: 'To become a trusted technology partner, helping businesses digitize processes and establish their presence online through breakthrough digital solutions.' 
        }
      ]
    }
  };

  const t = contentFallback[language];

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/30 selection:text-primary">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />
      
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {wpTitle ? (
            <h1 
              className="font-heading text-4xl md:text-5xl font-bold mb-12 text-primary glow-text-primary"
              dangerouslySetInnerHTML={{ __html: wpTitle }}
            />
          ) : (
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-primary glow-text-primary">
              {t.title}
            </h1>
          )}
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
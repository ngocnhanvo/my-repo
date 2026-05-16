import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo, WPProcessStep, WPComparison } from '@/entities';
import { useOutletContext } from 'react-router-dom';

interface NotFoundPageProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
}

interface OutletContextType {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

export default function NotFoundPage({ data_info }: NotFoundPageProps) {
  const { language, setLanguage } = useOutletContext<OutletContextType>();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';
  const t = language === 'en' ? {
    title: "PAGE NOT FOUND",
    desc: "The requested page was not found on the server. The connection might be unstable or the resource has been relocated.",
    btn: "BACK TO HOME",
    home: "/en"
  } : {
    title: "TRANG KHÔNG TỒN TẠI",
    desc: "Trang bạn yêu cầu không tìm thấy trên máy chủ. Kết nối có thể không ổn định hoặc tài nguyên đã được di chuyển.",
    btn: "VỀ TRANG CHỦ",
    home: "/vi"
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph overflow-clip">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />
      
      <main className="flex flex-col items-center justify-center min-h-[75vh] text-center p-8 pt-48">
        <div className="relative mb-12">
          {/* Số 404 mờ ảo phía sau */}
          <span className="text-[10rem] md:text-[15rem] font-bold opacity-5 select-none font-mono leading-none tracking-tighter">
            404
          </span>
          {/* Thông báo lỗi chính */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary tracking-tighter uppercase animate-pulse" style={{ textShadow: '0 0 20px rgba(0, 255, 204, 0.5)' }}>
              {t.title}
            </h2>
          </div>
        </div>
        
        <div className="space-y-8 max-w-2xl mx-auto">
          <p className="text-lg md:text-xl text-foreground/60 font-mono italic leading-relaxed">
            {`// system_status: ERROR_NOT_FOUND`} <br />
            {`// log: ${t.desc}`}
          </p>
          
          {/* Dùng thẻ <a> để reload app, đảm bảo data trang chủ được nạp đúng chuẩn */}
          <a 
            href={t.home} 
            className="inline-block px-10 py-5 bg-primary text-primary-foreground font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(0,255,204,0.4)]" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
          >
            {t.btn}
          </a>
        </div>
      </main>
      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />
    </div>
  );
};
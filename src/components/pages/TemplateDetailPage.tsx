import React, { useState } from 'react';
import { WPInfo, WPTemplate } from '@/entities';
import { useOutletContext, useParams, useNavigate, data } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Monitor, Tablet, Smartphone, ChevronDown, Check, X, ExternalLink } from 'lucide-react';
import { WPProduct } from '@/entities/wordpress';
import { formatCurrency } from '@/lib/stringUtils';

interface TemplateDetailPageProps {
  data_info: WPInfo[];
  data_templates?: WPTemplate[];
  data_products?: WPProduct[];
}
const currentUrl = window.location.href;

export default function TemplateDetailPage({ data_info = [], data_templates = [], data_products = [] }: TemplateDetailPageProps) {
  const { id } = useParams();
  const { language, setLanguage } = useOutletContext<{ language: 'vi' | 'en'; setLanguage: any }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  // Tìm template dựa trên ID từ URL
  const template = data_templates.find(t => String(t.id) === id);

  const templatePrice = template?.price?.[language];
 let displayPrice = '';
   if(templatePrice) {
     displayPrice = formatCurrency(templatePrice.price, templatePrice.currency);
     if(!displayPrice)
       displayPrice = templatePrice.price;
   }

  const t = {
    vi: {
      likeQuestion: 'Bạn thích mẫu này?',
      yesOption: 'Có, tôi muốn mẫu này',
      viewExternal: 'Tôi muốn xem trên tab riêng',
      noOption: 'Không, xem thêm mẫu khác',
      devices: { desktop: 'Máy tính', tablet: 'Máy tính bảng', mobile: 'Điện thoại' },
      prefillMsg: (name: string, price: string) => `Chào Vibe Code NVN, tôi rất thích mẫu website: "${name}".${price ? `\nGiá tham khảo: ${price}` : ''}\nTôi muốn được tư vấn triển khai mẫu này cho dự án của mình.\nLink: ${currentUrl}`
    },
    en: {
      likeQuestion: 'Do you like it?',
      yesOption: 'Yes, I want this',
      viewExternal: 'View on a separate tab',
      noOption: 'No, see other templates',
      devices: { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' },
      prefillMsg: (name: string, price: string) => `Hi Vibe Code NVN, I really like the "${name}" website template.${price ? `\nReference price: ${price}` : ''}\nI'd like to consult on deploying this for my project.\nLink: ${currentUrl}`
    },
  }[language];

  if (!template) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-foreground/60 font-mono tracking-widest uppercase italic">// 404_TEMPLATE_NOT_FOUND</p>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline uppercase text-sm font-bold tracking-tighter flex items-center gap-2 mx-auto">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to list
          </button>
        </div>
      </div>
    );
  }

  const templateName = template.title[language];
  const deviceConfig = {
    desktop: { width: '100%', icon: Monitor },
    tablet: { width: '768px', icon: Tablet },
    mobile: { width: '375px', icon: Smartphone }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Header Preview */}
      <header className="h-20 bg-background/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between z-10 shrink-0">
        {/* Bên trái: Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/${language}/templates`)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-foreground/60 hover:text-primary"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="hidden md:block">
            <h2 className="font-heading font-bold text-primary text-xl glow-text-primary uppercase tracking-tighter">
              {infoData[`${prefixWP}tencongty`] || 'VIBE CODE'}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] font-mono text-foreground/40 leading-none">{templateName}</p>
              {displayPrice && (
                <>
                  <span className="text-[10px] text-foreground/20">|</span>
                  <p className="text-[80%] font-mono font-bold leading-none uppercase tracking-tighter text-white">{displayPrice}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Ở giữa: Chọn thiết bị */}
        <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/5">
          {(['desktop', 'tablet', 'mobile'] as const).map((mode) => {
            const Icon = deviceConfig[mode].icon;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-xs font-mono uppercase tracking-widest ${
                  viewMode === mode 
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,204,0.3)]' 
                    : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
                }`}
                title={t.devices[mode]}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{t.devices[mode]}</span>
              </button>
            );
          })}
        </div>

        {/* Bên phải: Nút hành động */}
        <div 
          className="relative group" 
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="clip-edge bg-primary text-primary-foreground font-bold px-6 py-3 flex items-center gap-3 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,204,0.2)] active:scale-95 touch-manipulation"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">{t.likeQuestion}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} lg:group-hover:rotate-180`} />
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 top-full pt-2 transition-all duration-300 z-[110] pointer-events-auto
            ${isDropdownOpen 
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible translate-y-2 lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0'
            }`}
          >
            <div className="bg-[#0a0a0a] border border-primary/20 w-64 overflow-hidden shadow-2xl shadow-primary/20">
              <button 
                onClick={() => {
                  const msg = t.prefillMsg(templateName, displayPrice);
                  setIsDropdownOpen(false);
                  navigate(`/${language}/contact`, { state: { prefillMessage: msg } });
                }}
                className="w-full text-left p-4 hover:bg-primary/10 flex items-start gap-3 border-b border-white/5 transition-colors group/item"
              >
                <Check className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">{t.yesOption}</div>
                  <div className="text-[10px] text-foreground/40 font-mono mt-1 italic uppercase tracking-tighter">// System.InitContact()</div>
                </div>
              </button>
              <a 
                href={template.url[language]} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left p-4 hover:bg-white/5 flex items-start gap-3 border-b border-white/5 transition-colors group/item"
              >
                <ExternalLink className="w-5 h-5 text-foreground/40 mt-1" />
                <div>
                  <div className="text-sm font-bold text-foreground/70 group-hover/item:text-foreground transition-colors">{t.viewExternal}</div>
                  <div className="text-[10px] text-foreground/30 font-mono mt-1 italic uppercase tracking-tighter">// Browser.OpenExternal()</div>
                </div>
              </a>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate(`/${language}/templates`);
                }}
                className="w-full text-left p-4 hover:bg-white/5 flex items-start gap-3 transition-colors group/item"
              >
                <ArrowRight className="w-5 h-5 text-foreground/40 mt-1" />
                <div>
                  <div className="text-sm font-bold text-foreground/70 group-hover/item:text-foreground transition-colors">{t.noOption}</div>
                  <div className="text-[10px] text-foreground/30 font-mono mt-1 italic uppercase tracking-tighter">// Return.List()</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Iframe Preview Area */}
      <main className="flex-1 bg-[#151515] relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

        <motion.div 
          initial={false}
          animate={{ width: viewMode === 'mobile' ? '100%' : deviceConfig[viewMode].width }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="h-full bg-white shadow-2xl relative shadow-primary/5 overflow-auto ios-iframe-wrapper"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <iframe 
            src={template.url[language]} 
            className="w-full h-full border-none touch-auto"
            style={{ 
              width: '1px', 
              minWidth: '100%',
              height: '100%' 
            }}
            title={templateName}
          />
        </motion.div>
      </main>
    </div>
  );
};
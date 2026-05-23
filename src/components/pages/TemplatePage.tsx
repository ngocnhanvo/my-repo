import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo, WPTemplate } from '@/entities';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Crown, Sparkles } from 'lucide-react';
import { stripHtmlAndUnescape, formatCurrency } from '@/lib/stringUtils';
import { WPProduct } from '@/entities/wordpress';
import { NavigateFunction } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;
// Lazy Image Component với Intersection Observer
const LazyImage: React.FC<{
  src: string;
  srcSet: string;
  alt: string;
  containerClassName?: string;
  imgClassName?: string;
}> = ({ src, srcSet, alt, containerClassName = '', imgClassName = '' }) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Khung cố định luôn ở đây

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersected(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src, srcSet]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-white/5 ${containerClassName}`}>
      {/* Hiệu ứng pulse loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 animate-pulse z-10" />
      )}
      
      {/* Chỉ khi cuộn tới mới render cụm thẻ picture */}
      {isIntersected && (
        <picture>
          {/* Vì tất cả file trong srcSet của bạn là WebP nên điền vào đây */}
          <source srcSet={srcSet} type="image/webp" sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px" />
          
          <img 
            src={src} // Ảnh gốc dự phòng khi không chạy được source
            alt={alt} 
            className={`w-full h-full object-cover transition-all duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${imgClassName}`}
            onLoad={() => setIsLoaded(true)}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

// Package Badge Component
const PackageBadge: React.FC<{ type: string; label: string }> = ({ type, label }) => {
  const badgeConfig: Record<string, { icon: React.ReactNode; bgColor: string; textColor: string }> = {
    Starter: { icon: <Sparkles className="w-3 h-3" />, bgColor: 'bg-blue-500/20', textColor: 'text-blue-400' },
    Professional: { icon: <Zap className="w-3 h-3" />, bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
    Enterprise: { icon: <Crown className="w-3 h-3" />, bgColor: 'bg-amber-500/20', textColor: 'text-amber-400' },
  };

  const config = badgeConfig[type] || badgeConfig.Starter;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor} border border-current border-opacity-20`}>
      {config.icon}
      <span className={`text-xs font-semibold uppercase tracking-widest ${config.textColor}`}>{label}</span>
    </div>
  );
};

// Template Item Component
const TemplateItem: React.FC<{
  template: WPTemplate;
  language: 'vi' | 'en';
  infoData: WPInfo;
  data_products: WPProduct[];
  prefixWP: string;
  navigate: NavigateFunction;
  index: number;
  onSelect: (id: string | number) => void;
}> = ({ template, language, infoData, prefixWP, navigate, index }) => {
  const displayName = template.title[language];
  const displayDesc = stripHtmlAndUnescape(template.content[language]);
  const displayPackage = template.packageType[language];
  const templatePrice = template?.price?.[language];
  const type = template.packageType['en'];

  let displayPrice = '';
  if(templatePrice) {
    displayPrice = formatCurrency(templatePrice.price, templatePrice.currency);
    if(!displayPrice)
      displayPrice = templatePrice.price;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 4) * 0.1 }}
      viewport={{ once: true, margin: '100px' }}
      className="group cursor-pointer h-full"
      onClick={() => navigate(`/${language}/templates/${template.id}`)}
    >
      <div className="h-full flex flex-col glass-panel border-t-2 border-primary/20 hover:border-primary transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-primary/20">
        {/* Image Container */}
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5">
          <LazyImage 
            src={template.image[language].src} 
            srcSet={template.image[language].srcSet} 
            alt={displayName} 
            containerClassName="aspect-video" 
            imgClassName="object-top duration-[3000ms] group-hover:object-bottom group-hover:duration-[9000ms] ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          
          {/* Package Badge */}
          <div className="absolute top-4 right-4">
            <PackageBadge type={type} label={displayPackage} />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-6 space-y-4 flex flex-col">
          {/* Title */}
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
              {displayName}
            </h3>
            {/* Price - Đẩy về bên phải, chữ màu trắng, size 80% */}
            <span className="text-lg font-mono text-white whitespace-nowrap shrink-0">
              {displayPrice}
            </span>
          </div>
          {/* Description */}
          {displayDesc && (
            <p className="text-sm text-foreground/60 line-clamp-3 flex-1">
              {displayDesc}
            </p>
          )}

          {/* Features */}
          {(template.features) && (
            <div className="flex flex-wrap gap-2">
              {((template.features) || []).slice(0, 2).map((feature, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary/80 border border-primary/20">
                  {feature}
                </span>
              ))}
              {((template.features) || []).length > 2 && (
                <span className="text-xs px-2 py-1 rounded bg-primary/5 text-primary/60">
                  +{((template.features) || []).length - 2}
                </span>
              )}
            </div>
          )}

          {/* CTA Button */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <span className="text-primary font-mono text-xs uppercase tracking-widest">
              {language === 'vi' ? 'Xem Chi Tiết' : 'View Details'}
            </span>
            <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface TemplatePageProps {
  data_info: WPInfo[];
  data_templates?: WPTemplate[];
  data_products?: WPProduct[];
}

export default function TemplatePage({ data_info = [], data_templates = [], data_products = []}: TemplatePageProps) {
  const { language, setLanguage } = useOutletContext<{ language: 'vi' | 'en'; setLanguage: any }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  const t = {
    vi: {
      title: 'Mẫu Website',
      subtitle: 'Khám phá những mẫu website tuyệt vời được thiết kế chuyên nghiệp',
      loadMore: 'Xem Thêm',
      noMore: 'Không có thêm mẫu',
      allCategories: 'Tất Cả',
    },
    en: {
      title: 'Website Templates',
      subtitle: 'Explore beautifully designed professional website templates',
      loadMore: 'Load More',
      noMore: 'No more templates',
      allCategories: 'All',
    },
  }[language];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = data_templates.map(t => t.category).filter(Boolean);
    return cats;
  }, []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return data_templates.filter(
      (template) => selectedCategory === 'all' || template.category === selectedCategory
    );
  }, [selectedCategory]);

  // Displayed templates
  const displayedTemplates = useMemo(() => {
    return filteredTemplates.slice(0, displayedCount);
  }, [filteredTemplates, displayedCount]);

  // Load more logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && displayedCount < filteredTemplates.length) {
            setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredTemplates.length));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, filteredTemplates.length]);

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} data_products={data_products} />

      <main className="pt-40 pb-20">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary glow-text-primary mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-foreground/60 font-mono italic">{t.subtitle}</p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 flex flex-wrap justify-center gap-3"
          >
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDisplayedCount(ITEMS_PER_PAGE);
              }}
              className={`px-4 py-2 rounded-full font-mono text-sm uppercase tracking-widest transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-background border border-primary'
                  : 'border border-primary/30 text-primary/70 hover:border-primary hover:text-primary'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setDisplayedCount(ITEMS_PER_PAGE);
                }}
                className={`px-4 py-2 rounded-full font-mono text-sm uppercase tracking-widest transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-background border border-primary'
                    : 'border border-primary/30 text-primary/70 hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {displayedTemplates.map((template, index) => (
              <TemplateItem
                key={template.id}
                template={template}
                language={language}
                infoData={infoData}
                prefixWP={prefixWP}
                data_products={data_products}
                index={index}
                navigate={navigate}
                onSelect={() => {}} // Đã chuyển sang dùng navigate trực tiếp
              />
            ))}
          </div>

          {/* Load More Trigger */}
          <div
            ref={loadMoreRef}
            className="flex justify-center"
          >
            {displayedCount < filteredTemplates.length && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredTemplates.length))}
                className="px-8 py-3 rounded-full border-2 border-primary text-primary font-mono uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
              >
                {t.loadMore}
              </motion.button>
            )}
            {displayedCount >= filteredTemplates.length && filteredTemplates.length > 0 && (
              <p className="text-foreground/40 font-mono text-sm uppercase tracking-widest">{t.noMore}</p>
            )}
          </div>
        </div>
      </main>

      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />
    </div>
  );
}

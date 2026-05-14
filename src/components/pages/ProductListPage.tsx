import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo } from '@/entities';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { resolvePlaceholders, formatCurrency, getWebpPath } from '@/lib/stringUtils';

interface ProductListPageProps {
  data_info: WPInfo[];
  data_products?: any[];
}

export default function ProductListPage({ data_info, data_products = [] }: ProductListPageProps) {
  const { language, setLanguage } = useOutletContext<{ language: 'vi' | 'en', setLanguage: any }>();
  const navigate = useNavigate();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  const t = {
    vi: { title: 'Danh Mục Sản Phẩm', subtitle: 'Lựa chọn giải pháp phù hợp với doanh nghiệp của bạn', view: 'Xem chi tiết' },
    en: { title: 'Product Catalog', subtitle: 'Choose the right solution for your business', view: 'View Details' }
  }[language];

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />
      
      <main className="pt-40 pb-20">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary glow-text-primary mb-6">{t.title}</h1>
            <p className="text-xl text-foreground/60 font-mono italic">{t.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data_products.map((product, index) => {
              // Lấy tiêu đề tương ứng với ngôn ngữ đang chọn
              const displayTitle = language === 'en' 
                ? (product.en_title || product.title) 
                : (product.title || product.en_title);
              
              const title = resolvePlaceholders(displayTitle, infoData);
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel group cursor-pointer overflow-hidden border-t-2 border-primary/20 hover:border-primary transition-all"
                  onClick={() => navigate(`/${language}/products/${product.slug}`)}
                >
                  <div className="aspect-video relative overflow-hidden bg-white/5">
                    {product.image ? (
                      <picture>
                        <source srcSet={getWebpPath(product.image)} type="image/webp" />
                        <img 
                          src={product.image} 
                          alt={title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </picture>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors" 
                        dangerouslySetInnerHTML={{ __html: title }} />
                    
                    {product.price && (
                      <div className="text-xl font-mono text-primary/90 glow-text-primary">
                        {formatCurrency(product.price)}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-primary font-mono text-sm uppercase tracking-widest">{t.view}</span>
                      <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />
    </div>
  );
}

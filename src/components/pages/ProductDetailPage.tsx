import React from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo } from '@/entities';
import { resolvePlaceholders, formatCurrency } from '@/lib/stringUtils';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductDetailPageProps {
  data_info: WPInfo[];
  data_products?: any[];
}

export default function ProductDetailPage({ data_info, data_products = [] }: ProductDetailPageProps) {
  const { slug } = useParams();
  const { language, setLanguage } = useOutletContext<{ language: 'vi' | 'en', setLanguage: any }>();
  const navigate = useNavigate();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  // Tìm sản phẩm theo slug (không còn quan tâm tiền tố en_ vì đã được unified)
  const product = data_products.find(p => p.slug === slug || p.baseSlug === slug);

  if (!product) return null; // Hoặc render trang 404

  // Chọn nội dung hiển thị dựa trên ngôn ngữ hiện tại
  const displayTitle = language === 'en' ? (product.en_title || product.title) : (product.title || product.en_title);
  const displayContent = language === 'en' ? (product.en_content || product.content) : (product.content || product.en_content);

  const title = resolvePlaceholders(displayTitle, infoData);
  const content = resolvePlaceholders(displayContent, infoData);

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />
      
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-mono text-sm uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'vi' ? 'Quay lại' : 'Back'}
          </motion.button>

          <article className="space-y-12">
            <header className="space-y-6">
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary glow-text-primary" 
                  dangerouslySetInnerHTML={{ __html: title }} />
              
              {product.price && (
                <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 text-2xl md:text-3xl font-mono text-primary glow-text-primary">
                  {formatCurrency(product.price)}
                </div>
              )}

              {product.image && (
                <div className="aspect-video w-full overflow-hidden border border-white/10 glass-panel">
                  <img src={product.image} alt={title} className="w-full h-full object-cover" />
                </div>
              )}
            </header>

            <div className="prose prose-invert max-w-none text-foreground/70 leading-relaxed article-content"
                 dangerouslySetInnerHTML={{ __html: content }} />

            <div className="pt-12 border-t border-white/10">
              <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-bold mb-2">{language === 'vi' ? 'Bạn quan tâm đến giải pháp này?' : 'Interested in this solution?'}</h4>
                  <p className="text-foreground/50 text-sm">{language === 'vi' ? 'Hãy để chúng tôi giúp bạn triển khai hệ thống.' : 'Let us help you deploy the system.'}</p>
                </div>
                <Button 
                  size="lg" 
                  className="clip-edge bg-primary text-black font-bold px-8 py-6" 
                  onClick={() => {
                    const currentUrl = window.location.href;
                    const priceLabel = product.price ? formatCurrency(product.price) : (language === 'vi' ? 'Liên hệ' : 'Contact');
                    const prefill = language === 'vi'
                      ? `Chào Vibe Code NVN, tôi cần tư vấn về:\n- Sản phẩm: ${title}\n- Giá: ${priceLabel}\n- Link: ${currentUrl}`
                      : `Hi Vibe Code NVN, I need a consultation for:\n- Product: ${title}\n- Price: ${priceLabel}\n- Link: ${currentUrl}`;
                    
                    navigate(`/${language}/contact`, { state: { prefillMessage: prefill } });
                  }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {language === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact us'}
                </Button>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />
    </div>
  );
}

import { WPInfo } from '@/entities/wordpress';
import { motion } from 'framer-motion';
import { Code, Zap, Globe } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface FooterProps {
  language: 'vi' | 'en';
  infoData: WPInfo;
  prefixWP?: string;
}

export default function Footer({ language, infoData, prefixWP }: FooterProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const content = {
    vi: {
      tagline: 'Tốc độ AI & Chất lượng Developer',
      copyright: `© 2026 ${infoData[`${prefixWP}tencongty`]}. Tất cả quyền được bảo lưu.`,
      links: {
        services: 'Dịch Vụ',
        about: 'Về Chúng Tôi',
        contact: 'Liên Hệ',
        privacy: 'Chính Sách',
        terms: 'Điều Khoản'
      },
      social: {
        title: 'Kết Nối'
      }
    },
    en: {
      tagline: 'AI Speed & Developer Quality',
      copyright: `© 2026 ${infoData[`${prefixWP}tencongty`]}. All rights reserved.`,
      links: {
        services: 'Services',
        about: 'About Us',
        contact: 'Contact',
        privacy: 'Privacy',
        terms: 'Terms'
      },
      social: {
        title: 'Connect'
      }
    }
  };

  const t = content[language];

  // Function to generate language-prefixed URLs for anchor links
  const getLocalizedAnchorHref = (anchorId: string) => {
    const pathWithoutLang = location.pathname.replace(/^\/(vi|en)/, '');
    return `/${language}${pathWithoutLang.split('#')[0]}${anchorId}`;
  };

  const handleNavClick = (anchorId: string) => {
    const isHomePage = location.pathname === `/${language}` || location.pathname === `/${language}/`;
    
    if (isHomePage) {
      const element = document.getElementById(anchorId.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/${language}`, { state: { scrollTo: anchorId.replace('#', '') }, preventScrollReset: true });
    }
  };

  return (
    <footer className="relative w-full bg-gradient-to-t from-background via-primary/5 to-background border-t border-primary/20">
      <div className="w-full max-w-[120rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                {infoData.logo ? (
                  <img 
                    src={infoData.logo} 
                    alt={infoData[`${prefixWP}tencongty`] || 'Logo'} 
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : (
                  <span className="text-primary-foreground font-bold text-xl">V</span>
                )}
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">{infoData[`${prefixWP}tencongty`]}</h3>
              </div>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {t.tagline}
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-secondary" />
              </div>
              <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent-blue" />
              </div>
            </div>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-heading text-lg font-bold text-foreground">{t.links.services}</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick('#process')}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {language === 'vi' ? 'Quy Trình Làm Việc' : 'Workflow Process'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#comparison')}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {language === 'vi' ? 'So Sánh Dịch Vụ' : 'Service Comparison'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#pricing')}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {language === 'vi' ? 'Bảng Giá' : 'Pricing'}
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-heading text-lg font-bold text-foreground">{t.links.about}</h4>
            <ul className="space-y-2">
              <li>
                <Link to={`/${language}/about`} className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.links.about}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/contact`}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {t.links.contact}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/privacy`} className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.links.privacy}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/terms`} className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.links.terms}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-heading text-lg font-bold text-foreground">{t.links.contact}</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>{language === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City'}</li>
              <li>{language === 'vi' ? 'Việt Nam' : 'Vietnam'}</li>
              <li className="pt-2">
                <a href={`mailto:${infoData.email}`} className="hover:text-primary transition-colors break-words">
                  {infoData.email}
                </a>
              </li>
              <li>
                <a href={`tel:${infoData.sodienthoai}`} className="hover:text-primary transition-colors">
                  {infoData.sodienthoai}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-primary/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/60 text-sm text-center md:text-left">
              {t.copyright}
            </p>
            <div className="flex items-center gap-6">
              <Link to={`/${language}/privacy`} className="text-foreground/60 hover:text-primary transition-colors text-sm">
                {t.links.privacy}
              </Link>
              <Link to={`/${language}/terms`} className="text-foreground/60 hover:text-primary transition-colors text-sm">
                {t.links.terms}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

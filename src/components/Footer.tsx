import { motion } from 'framer-motion';
import { Code, Zap, Globe } from 'lucide-react';

interface FooterProps {
  language: 'vi' | 'en';
}

export default function Footer({ language }: FooterProps) {
  const content = {
    vi: {
      tagline: 'Tốc độ AI & Chất lượng Developer',
      copyright: '© 2026 Vibe Code Studio. Tất cả quyền được bảo lưu.',
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
      copyright: '© 2026 Vibe Code Studio. All rights reserved.',
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
                <span className="text-primary-foreground font-bold text-2xl">V</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">Vibe Code Studio</h3>
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
                  onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {language === 'vi' ? 'Quy Trình Làm Việc' : 'Workflow Process'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {language === 'vi' ? 'So Sánh Dịch Vụ' : 'Service Comparison'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
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
                <button
                  onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {language === 'vi' ? 'Giới Thiệu' : 'About'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {t.links.contact}
                </button>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.links.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.links.terms}
                </a>
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
                <a href="mailto:contact@vibecodestudio.com" className="hover:text-primary transition-colors">
                  contact@vibecodestudio.com
                </a>
              </li>
              <li>
                <a href="tel:+84123456789" className="hover:text-primary transition-colors">
                  +84 123 456 789
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
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                {t.links.privacy}
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                {t.links.terms}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

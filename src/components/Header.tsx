import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { WPInfo } from '@/entities';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation, useNavigate
import { getWebpPath, resolvePlaceholders } from '@/lib/stringUtils';

interface HeaderProps {
  language: 'vi' | 'en';
  infoData: WPInfo; // Thêm prop infoData để truyền dữ liệu từ HomePage
  prefixWP: string; // Thêm prop prefixWP để truyền dữ liệu từ HomePage
  setLanguage: (lang: 'vi' | 'en') => void;
  data_products?: any[]; // Thêm data_products vào props
}

export default function Header({ language, infoData, prefixWP, setLanguage, data_products }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation(); // Get current location to construct new URLs
  const navigate = useNavigate();

  // Tự động đóng menu khi đường dẫn (pathname) thay đổi
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileSubmenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, location.search]); // Theo dõi pathname để đóng menu ngay khi đổi trang

  const content = {
    vi: {
      nav: {
        home: 'Trang Chủ',
        about: 'Giới Thiệu',
        products: 'Sản Phẩm',
        contact: 'Liên Hệ'
      },
      toggleMenu: 'Mở/Đóng menu'
    },
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        products: 'Products',
        contact: 'Contact'
      },
      toggleMenu: 'Toggle menu'
    }
  };

  const t = content[language];

  // Hàm kiểm tra trạng thái active của menu
  const isActive = (href: string) => {
    const isHomePage = location.pathname === `/${language}` || location.pathname === `/${language}/`;
    if (href.startsWith('#')) {
      return isHomePage; // Các link neo (#hero) chỉ active khi ở trang chủ
    }
    // Với các trang khác, kiểm tra xem pathname có bắt đầu bằng đường dẫn menu không (hỗ trợ trang con /products/slug)
    return location.pathname.startsWith(`/${language}${href}`);
  };

  // Function to generate language-prefixed URLs
  const getLocalizedHref = (href: string) => {
    // Remove existing language prefix if any, then add the current one
    const pathWithoutLang = location.pathname.replace(/^\/(vi|en)/, '');
    return `/${language}${pathWithoutLang.startsWith('/') ? '' : '/'}${href}`;
  };

  const navItems = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.about, href: '/about' },
    { 
      label: t.nav.products, 
      href: '/products',
      children: data_products?.map(p => ({
        label: resolvePlaceholders(language === 'en' ? (p.en_title || p.title) : (p.title || p.en_title), infoData),
        href: `/products/${p.baseSlug || p.slug}`
      }))
    },
    { label: t.nav.contact, href: '/contact' } // Thay đổi để dẫn đến trang /contact
  ];

  const handleNavClick = (href: string) => {
    setActiveDropdown(null);
    const targetId = href.replace('#', '');
    const isHomePage = location.pathname === `/${language}` || location.pathname === `/${language}/`;
    
    if (href.startsWith('#')) { // Đây là một liên kết neo (anchor)
      if (isHomePage) { // Nếu đang ở trang chủ, cuộn đến vị trí
        setIsMenuOpen(false);
        setIsMobileSubmenuOpen(false);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else { // Nếu không ở trang chủ, điều hướng về trang chủ và cuộn
        // Khi về trang chủ từ trang khác, useEffect [location.pathname] sẽ lo việc đóng menu
        navigate(`/${language}`, { state: { scrollTo: targetId }, preventScrollReset: true });
      }
    } else { // Đây là một đường dẫn trang (ví dụ: /contact)
      // Đảm bảo đóng menu TRƯỚC khi thực hiện điều hướng để tránh lag giao diện
      setIsMenuOpen(false);
      setIsMobileSubmenuOpen(false);
      
      const targetPath = `/${language}${href.startsWith('/') ? href : `/${href}`}`;
      navigate(targetPath);
      window.scrollTo(0, 0); // Đảm bảo cuộn lên đầu trang mới
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
      <div className="w-full max-w-[120rem] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 cursor-pointer" // Still scroll to hero on logo click
            onClick={() => handleNavClick('#hero')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center overflow-hidden">
              {infoData.logo ? (
                <picture>
                <source srcSet={getWebpPath(infoData.logo)} type="image/webp" />
                <img 
                  src={infoData.logo} 
                  alt={infoData[`${prefixWP}tencongty`] || 'Logo'} 
                  className="w-full h-full object-contain p-1.5"
                />
                </picture>
              ) : (
                <span className="text-primary-foreground font-bold text-xl">V</span>
              )}
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground max-[420px]:text-[60%]">
                {infoData[`${prefixWP}tencongty`]}
              </h2>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <div 
                key={item.href} 
                className="relative group"
                onMouseEnter={() => item.children && setActiveDropdown(item.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative py-2 transition-colors font-medium flex items-center gap-1 ${
                    isActive(item.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${
                      activeDropdown === item.href ? 'rotate-180' : ''
                    }`} />
                  )}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </motion.button>

                {/* Desktop Dropdown */}
                {item.children && (
                  <div className={`absolute top-full left-0 pt-4 transition-all duration-300 ${
                    activeDropdown === item.href 
                      ? "opacity-100 visible translate-y-0" 
                      : "opacity-0 invisible translate-y-2"
                  }`}>
                    <div className="bg-[#0a0a0a] border border-primary/20 min-w-[240px] p-2 flex flex-col shadow-2xl shadow-primary/20">
                      {item.children.map((subItem) => (
                        <button
                          key={subItem.href}
                          onClick={() => handleNavClick(subItem.href)}
                          className="text-left px-4 py-3 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors font-mono"
                          dangerouslySetInnerHTML={{ __html: subItem.label }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 bg-primary/10 rounded-lg p-1"
            >
              <button
                onClick={() => setLanguage('vi')} // Use the setLanguage prop from HomePage
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  language === 'vi'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage('en')} // Use the setLanguage prop from HomePage
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                EN
              </button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={t.toggleMenu}
              className="lg:hidden text-foreground p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-primary/20 pt-4 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <div key={item.href} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className={`transition-colors font-medium text-left py-2 border-l-4 pl-3 flex-1 ${
                          isActive(item.href) ? "text-primary border-primary bg-primary/5" : "text-foreground/80 border-transparent"
                        }`}
                      >
                        {item.label}
                      </button>
                      {item.children && (
                        <button 
                          onClick={() => setIsMobileSubmenuOpen(!isMobileSubmenuOpen)}
                          className="p-2 text-foreground/50"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform ${isMobileSubmenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    {item.children && isMobileSubmenuOpen && (
                      <div className="flex flex-col ml-4 mt-2 border-l border-white/10">
                        {item.children.map((subItem) => (
                          <button
                            key={subItem.href}
                            onClick={() => handleNavClick(subItem.href)}
                            className="text-left px-6 py-3 text-sm text-foreground/60 font-mono"
                            dangerouslySetInnerHTML={{ __html: subItem.label }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

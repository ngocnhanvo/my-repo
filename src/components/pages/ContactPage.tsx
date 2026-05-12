import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WPInfo, WPProcessStep, WPComparison } from '@/entities';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, User, MessageSquare, Loader2, CheckCircle2, Home, ArrowRight, Mail } from 'lucide-react';

interface ContactPageProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[]; // Keep data_info as it's used
  WC_URL: string; // Keep WC_URL if it's needed for other purposes, though not directly used here
}

interface OutletContextType {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

export default function ContactPage({ data_info }: ContactPageProps) {
  const { language, setLanguage } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();
  const location = useLocation();
  const infoData = data_info[0] || { id: 0 };
  const prefixWP = language === 'en' ? 'en_' : '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const validatePhone = (phone: string) => {
    // Regex cho số điện thoại Việt Nam: bắt đầu bằng 0 hoặc +84, theo sau là các đầu số 3,5,7,8,9 và 8 chữ số
    const vnPhoneRegex = /^(0|(\+84))(3|5|7|8|9)([0-9]{8})$/;
    return vnPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Tự động điền tin nhắn nếu có dữ liệu truyền từ trang sản phẩm
  useEffect(() => {
    const state = location.state as { prefillMessage?: string };
    if (state?.prefillMessage) {
      setFormData(prev => ({ ...prev, message: state.prefillMessage }));
      // Xóa state sau khi đã điền để tránh việc load lại trang vẫn giữ tin nhắn cũ
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    let timer: any;
    if (status === 'success') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate(`/${language}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, navigate, language]);

  const t = {
    vi: {
      title: 'Liên Hệ Với Chúng Tôi',
      subtitle: 'Gửi yêu cầu khởi động dự án của bạn ngay hôm nay',
      name: 'Họ và tên',
      phone: 'Số điện thoại',
      email: 'Email (Không bắt buộc)',
      message: 'Nội dung tin nhắn',
      send: 'Gửi Tín Hiệu',
      sending: 'Đang truyền dữ liệu...',
      success: 'Đã gửi thành công! Chúng tôi sẽ liên hệ lại sớm.',
      error: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
      invalidPhone: 'Số điện thoại không hợp lệ (Ví dụ: 0912345678 hoặc +84912345678)'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Send your request to initialize your project today',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email (Optional)',
      message: 'Message Content',
      send: 'Transmit Signal',
      sending: 'Transmitting...',
      success: 'Sent successfully! We will contact you soon.',
      error: 'An error occurred. Please try again later.',
      invalidPhone: 'Invalid phone number (Example: 0912345678 or +84912345678)'
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      setErrorMessage(t.invalidPhone);
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          toEmail: infoData.email,
          companyName: infoData[`${prefixWP}tencongty`]
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setErrorMessage(t.error);
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage(t.error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/30 selection:text-primary">
      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />
      
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 text-primary glow-text-primary">{t.title}</h1>
            <p className="text-foreground/60 font-mono italic">{t.subtitle}</p>
          </motion.div>

          <div className="glass-panel p-8 md:p-12 border-t-2 border-primary/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-foreground/50 flex items-center gap-2">
                    <User className="w-3 h-3" /> {t.name} <span className="text-secondary font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-background border border-white/10 p-4 focus:border-primary outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-foreground/50 flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {t.phone} <span className="text-secondary font-bold">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full bg-background border border-white/10 p-4 focus:border-primary outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => {
                      // Chỉ cho phép nhập số và dấu + ở đầu
                      const val = e.target.value.replace(/[^0-9+]/g, '');
                      setFormData({...formData, phone: val});
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground/50 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> {t.email}
                </label>
                <input
                  type="email"
                  className="w-full bg-background border border-white/10 p-4 focus:border-primary outline-none transition-colors"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-foreground/50 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> {t.message} <span className="text-secondary font-bold">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-background border border-white/10 p-4 focus:border-primary outline-none transition-colors resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button
                disabled={status === 'loading'}
                type="submit"
                className="w-full clip-edge bg-primary text-primary-foreground font-bold py-6 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {status === 'loading' ? t.sending : t.send}
              </button>

              {status === 'success' && (
                <p className="text-primary font-mono text-center text-sm">{t.success}</p>
              )}
              {status === 'error' && (
                <p className="text-secondary font-mono text-center text-sm">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full p-8 md:p-12 text-center space-y-8 glass-panel border-t-2 border-primary/30"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                  <CheckCircle2 className="w-10 h-10 text-primary animate-bounce" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary glow-text-primary uppercase tracking-tighter">
                  {language === 'vi' ? 'Cảm ơn bạn!' : 'Thank You!'}
                </h2>
                <p className="text-foreground/80 leading-relaxed font-paragraph">
                  {t.success}
                </p>
                <div className="py-2 px-4 bg-primary/5 rounded-none border-l-2 border-primary inline-block">
                  <p className="text-xs font-mono text-primary/70">
                    {language === 'vi' 
                      ? `Hệ thống sẽ chuyển hướng sau ${countdown} giây...` 
                      : `Redirecting in ${countdown}s...`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/${language}`)}
                className="w-full clip-edge bg-primary text-primary-foreground font-bold py-5 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all group"
              >
                <Home className="w-5 h-5" />
                {language === 'vi' ? 'Về Trang Chủ Ngay' : 'Back to Home Now'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

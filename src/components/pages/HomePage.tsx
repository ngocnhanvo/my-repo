// HPI 1.7-G
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion'; // Removed AnimatePresence as it's not used here
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Zap, Code, Globe, ArrowRight, Terminal, Cpu, Layers, ChevronRight, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { content } from '@/lib/wordpress/trangchu';
import { WPProcessStep, WPComparison, WPInfo } from '@/entities';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom'; // Import useOutletContext, useLocation, useNavigate
import { getWebpPath } from '@/lib/stringUtils';

// 1. Định nghĩa kiểu dữ liệu cho Props
interface HomePageProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
}
// Define the context type
interface OutletContextType {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}
export default function HomePage({ data_process_steps, data_compre, data_info, WC_URL }: HomePageProps) {
  // Get language and setLanguage from OutletContext
  const { language, setLanguage } = useOutletContext<OutletContextType>();
  const location = useLocation();
  const navigate = useNavigate();
  const [processSteps, setProcessSteps] = useState<WPProcessStep[]>([]);
  const [comparisonData, setComparisonData] = useState<WPComparison[]>([]);
  const [infoData, setDataInfo] = useState<WPInfo>({ id: 0 });
  const [isLoadingSteps, setIsLoadingSteps] = useState(true);
  const [isLoadingComparison, setIsLoadingComparison] = useState(true);

  // Refs for scroll animations - ALWAYS RENDERED
  const heroRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const processLineHeight = useTransform(processProgress, [0.2, 0.8], ["0%", "100%"]);
  let prefixWP = language === 'en' ? 'en_' : '';
  
  useEffect(() => {
    loadData();
  }, []);

  // Xử lý cuộn trang khi quay lại từ trang khác hoặc nhấn link từ Footer/Header
  useEffect(() => {
    if (!isLoadingSteps && !isLoadingComparison) {
      const state = location.state as { scrollTo?: string };
      const targetId = state?.scrollTo || (location.hash ? location.hash.replace('#', '') : null);

      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          // Sử dụng requestAnimationFrame để đảm bảo trình duyệt đã vẽ xong layout mới nhất
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          });
        }
      }
    }
  }, [isLoadingSteps, isLoadingComparison, location.state, location.hash]);

  // Helper function to get WebP path from original image path


  const loadData = async () => {
    try {
      const stepsResult = data_process_steps;
      const comparisonResult = data_compre;
      const finalSteps = stepsResult.sort((a, b) => a.order - b.order);
      const finalComparison = comparisonResult.sort((a, b) => a.order - b.order);
      setProcessSteps(finalSteps);
      setComparisonData(finalComparison);
      setDataInfo(data_info[0]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingSteps(false);
      setIsLoadingComparison(false);
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/30 selection:text-primary overflow-clip">
      <style>{`
        .tech-grid {
          background-image: 
            linear-gradient(to right, rgba(0, 255, 204, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 204, 0.03) 1px, transparent 1px);
          background-size: 4rem 4rem;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }
        .glow-text-primary {
          text-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
        }
        .glow-text-secondary {
          text-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        }
        .glass-panel {
          background: rgba(26, 26, 26, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .clip-edge {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
        }
      `}</style>

      <Header language={language} infoData={infoData} prefixWP={prefixWP} setLanguage={setLanguage} />

      {/* HERO SECTION - The Digital Forge */}
      <section 
        id="hero" 
        ref={heroRef}
        className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Dynamic Backgrounds */}
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute inset-0 tech-grid z-0 opacity-50" />
        
        {/* Glowing Orbs */}
        <motion.div 
          style={{ y: useTransform(heroProgress, [0, 1], ["0%", "100%"]) }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] z-0 pointer-events-none"
        />
        <motion.div 
          style={{ y: useTransform(heroProgress, [0, 1], ["0%", "-100%"]) }}
          className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[100px] z-0 pointer-events-none"
        />

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-24"
        >
          {/* Left Content - Typography as Code */}
          <div className="flex-1 space-y-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-none border-l-2 border-primary bg-primary/5 backdrop-blur-sm"
            >
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono tracking-widest text-primary uppercase">System.Init() // {infoData[`${prefixWP}tencongty`]}</span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="font-heading text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tighter"
              >
                <span className="block text-primary glow-text-primary">{t.hero.title1}</span>
                <span className="block text-foreground mt-2 flex items-center gap-4">
                  <span className="text-secondary glow-text-secondary text-5xl sm:text-6xl lg:text-7xl">&</span> 
                  {t.hero.title2.split(' ')[0]}
                </span>
                <span className="block text-foreground">{t.hero.title2.split(' ').slice(1).join(' ')}</span>
              </motion.h1>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl space-y-6"
            >
              <p className="text-xl lg:text-2xl text-foreground/90 font-medium border-l-2 border-secondary/50 pl-6">
                {t.hero.subtitle}
              </p>
              <p className="text-base lg:text-lg text-foreground/60 pl-6 font-mono text-sm">
                {t.hero.description}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <Button 
                size="lg" 
                className="clip-edge bg-primary text-primary-foreground hover:bg-primary/80 font-bold px-10 py-7 text-lg rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,204,0.4)] group"
                onClick={() => navigate(`/${language}/contact`)} // Điều hướng đến trang /contact
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  {t.hero.cta}
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="clip-edge border-secondary/50 text-foreground hover:bg-secondary/10 hover:text-secondary hover:border-secondary font-medium px-10 py-7 text-lg rounded-none transition-all duration-300"
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  <Cpu className="w-5 h-5" />
                  {t.hero.ctaSecondary}
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Abstract Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1 relative hidden lg:flex justify-center items-center w-full h-[600px]"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Central Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-primary/30 flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary blur-[2px]" />
                  <div className="w-32 h-32 rounded-full border border-secondary/30 flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                    <div className="absolute inset-0 rounded-full border-b-2 border-secondary blur-[2px]" />
                    <div className="w-16 h-16 bg-background rounded-full shadow-[0_0_50px_rgba(0,255,204,0.5)] flex items-center justify-center z-10">
                      <Code className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Interface Cards */}
              <motion.div
                animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-0 glass-panel p-4 rounded-none border-l-2 border-primary w-48"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-primary">AI_ENGINE</span>
                </div>
                <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [15, -15, 15], x: [5, -5, 5] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-0 glass-panel p-4 rounded-none border-r-2 border-secondary w-56"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-mono text-secondary">DEV_STACK</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-secondary/20 flex items-center justify-center text-[10px] font-mono">React</div>
                  <div className="h-6 w-6 bg-secondary/20 flex items-center justify-center text-[10px] font-mono">Node</div>
                  <div className="h-6 w-6 bg-secondary/20 flex items-center justify-center text-[10px] font-mono">Wix</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* PROCESS SECTION - The Pipeline */}
      <section 
        id="process" 
        ref={processRef}
        className="relative w-full py-32 bg-background border-t border-white/5"
      >
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sticky Header */}
            <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono uppercase">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                Sequence Initiated
              </div>
              <h2 className="font-heading text-5xl lg:text-6xl font-bold leading-tight">
                {t.process.title}
              </h2>
              <p className="text-lg text-foreground/60 font-mono">
                {t.process.subtitle}
              </p>
            </div>

            {/* Process Pipeline */}
            <div className="lg:w-2/3 relative">
              {/* Animated connecting line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-white/5 hidden md:block">
                <motion.div 
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-secondary to-transparent"
                  style={{ height: processLineHeight }}
                />
              </div>

              <div className="space-y-12 md:space-y-24">
                {isLoadingSteps ? (
                  // Loading Skeleton - Ensures refs don't crash if we added them inside
                  [1, 2, 3].map((i) => (
                    <div key={i} className="glass-panel p-8 h-64 animate-pulse border-l-4 border-white/10" />
                  ))
                ) : processSteps.length > 0 ? (
                  processSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="relative pl-0 md:pl-20 group"
                    >
                      {/* Node Indicator */}
                      <div className="hidden md:flex absolute left-0 top-8 w-14 h-14 rounded-none bg-background border-2 border-primary/30 items-center justify-center z-10 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(0,255,204,0.3)] transition-all duration-300 rotate-45">
                        <span className="font-mono text-primary font-bold -rotate-45">0{step.order}</span>
                      </div>

                      <div className="glass-panel p-8 lg:p-10 border-l-4 border-primary/50 hover:border-primary transition-colors duration-300 relative overflow-hidden">
                        {/* Background accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <div className="flex flex-col xl:flex-row gap-8 relative z-10">
                          <div className="flex-1 space-y-4">
                            <div className="md:hidden text-primary font-mono text-sm mb-2">
                              // Phase 0{step.order}
                            </div>
                            <h3 className="font-heading text-3xl font-bold text-foreground" dangerouslySetInnerHTML={{ __html: step[`${prefixWP}tieudechinh`] }} />
                            <p className="text-foreground/70 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: step[`${prefixWP}mota`] }} />

                            {step[`${prefixWP}benefit`] && (
                              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-secondary/10 border border-secondary/20 text-secondary text-sm font-mono">
                                <Check className="w-4 h-4" />
                                {step[`${prefixWP}benefit`]}
                              </div>
                            )}
                          </div>

                          {step.image && (
                            <div className="xl:w-1/3 shrink-0">
                              <div className="relative aspect-video xl:aspect-square overflow-hidden border border-white/10 group-hover:border-primary/30 transition-colors">
                                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
                                <picture>
                                  <source srcSet={getWebpPath(step.image)} type="image/webp" />
                                  <img
                                    src={step.image}
                                    alt={step[`${prefixWP}tieudechinh`] || ''}
                                    width={600}
                                    className="w-full h-full object-cover transition-all duration-500 scale-105 group-hover:scale-100 grayscale-0 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                                  />
                                </picture>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-panel p-12 text-center border-l-4 border-white/10">
                    <p className="text-foreground/50 font-mono">
                      {language === 'vi' ? 'Đang chờ dữ liệu quy trình...' : 'Awaiting process data...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION - The Data Matrix */}
      <section 
        id="comparison" 
        ref={comparisonRef}
        className="relative w-full py-32 bg-[#111] border-t border-white/5 overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-primary/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase mx-auto">
              <Code className="w-4 h-4" />
              Data Matrix Analysis
            </div>
            <h2 className="font-heading text-5xl lg:text-7xl font-bold">
              {t.comparison.title}
            </h2>
            <p className="text-xl text-foreground/60 font-mono max-w-3xl mx-auto">
              {t.comparison.subtitle}
            </p>
          </motion.div>

          <div className="relative">
            {isLoadingComparison ? (
               <div className="h-[400px] glass-panel animate-pulse" />
            ) : comparisonData.length > 0 ? (
              <div className="overflow-x-auto pb-8">
                <div className="min-w-[800px] w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 mb-4 px-6 text-xs font-mono uppercase tracking-wider text-foreground/50">
                    <div className="col-span-4">{t.comparison.feature}</div>
                    <div className="col-span-4 text-primary">{t.comparison.vibeStudio}</div>
                    <div className="col-span-4">{t.comparison.standardWix}</div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-3">
                    {comparisonData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="grid grid-cols-12 gap-4 p-6 glass-panel hover:bg-white/[0.02] transition-colors items-start group"
                      >
                        {/* Feature Column */}
                        <div className="col-span-4 pr-4 border-r border-white/10">
                          <p className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                            {item[`${prefixWP}thongsokythuat`]}
                          </p>
                          {item[`${prefixWP}thongsokythuat`] && (
                            <p className="text-sm text-foreground/50 font-mono">
                              {/* {item[`${prefixWP}thongsokythuat`]} */}
                            </p>
                          )}
                        </div>

                        {/* Vibe Studio Column (Highlighted) */}
                        <div className="col-span-4 px-4 relative">
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          <div className="flex items-start gap-3 relative z-10">
                            <div className="mt-1 bg-primary/20 p-1 rounded-sm">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-foreground font-medium mb-1">
                                {item[`${prefixWP}chungtoi`]}
                              </p>
                              {item[`${prefixWP}chungtoi`] && (
                                <p className="text-xs text-foreground/40 font-mono">
                                  {/* {item[`${prefixWP}chungtoi`]} */}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Standard Wix Column */}
                        <div className="col-span-4 pl-4 border-l border-white/10 opacity-100 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-white/10 p-1 rounded-sm">
                              <AlertTriangle className="w-4 h-4 text-foreground/50" />
                            </div>
                            <div>
                              <p className="text-foreground font-medium mb-1">
                                {item[`${prefixWP}wix_0`]}
                              </p>
                              {item[`${prefixWP}wix_0`] && (
                                <p className="text-xs text-foreground/40 font-mono">
                                  {/* - {item[`${prefixWP}wix_0`]} */}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 text-center">
                <p className="text-foreground/50 font-mono">
                  {language === 'vi' ? 'Không có dữ liệu phân tích' : 'No analysis data available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - The Configuration */}
      <section id="pricing" className="relative w-full py-32 bg-background border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-blue/10 via-background to-background pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-mono uppercase">
                <Zap className="w-4 h-4" />
                Deployment Config
              </div>
              <h2 className="font-heading text-5xl lg:text-7xl font-bold">
                {t.pricing.title}
              </h2>
              <p className="text-xl text-foreground/60 font-mono">
                {t.pricing.subtitle}
              </p>
              
              <ul className="space-y-4 font-mono text-sm text-foreground/80">
                <li className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-accent-blue" />
                  {language === 'vi' ? 'Kiến trúc mã nguồn tối ưu' : 'Optimized source code architecture'}
                </li>
                <li className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-accent-blue" />
                  {language === 'vi' ? 'Ứng dụng AI trong phát triển website' : 'AI-assisted website development'}
                </li>
                <li className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-accent-blue" />
                  {language === 'vi' ? 'Bảo mật cấp doanh nghiệp' : 'Enterprise-grade security'}
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-blue to-secondary rounded-none blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative glass-panel p-12 border border-white/10 flex flex-col items-center text-center">
                <div className="mb-8">
                  <p className="text-sm font-mono text-foreground/50 uppercase tracking-widest mb-4">{t.pricing.from}</p>
                  <div className="flex items-start justify-center gap-2">
                    <span className="text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-blue">
                      3M
                    </span>
                    <span className="text-xl text-foreground/50 font-mono mt-2">{t.pricing.currency}</span>
                  </div>
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />
                
                <Button 
                  size="lg" 
                  className="w-full clip-edge bg-accent-blue text-white hover:bg-accent-blue/80 font-bold px-12 py-8 text-lg rounded-none transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,123,255,0.4)]"
                  onClick={() => navigate(`/${language}/products`)}
                >
                  {t.pricing.contact}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION - The Terminal */}
      <section id="contact" className="relative w-full py-32 bg-[#0a0a0a] border-t border-white/5">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-5xl lg:text-7xl font-bold mb-6">
              {t.contact.title}
            </h2>
            <p className="text-xl text-foreground/60 font-mono max-w-3xl mx-auto">
              {t.contact.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: Globe, 
                title: language === 'vi' ? 'Địa chỉ' : 'Address', 
                value: infoData[`${prefixWP}diachi`], 
                color: 'text-primary', 
                bg: 'bg-primary/10', 
                border: 'border-primary/30',
                href: "https://www.google.com/maps/search/?api=1&query=10.877367565856778,106.76548063620464"
              },
              { 
                icon: Code, 
                title: language === 'vi' ? 'Email' : 'Email', 
                value: infoData[`email`], 
                color: 'text-secondary', 
                bg: 'bg-secondary/10', 
                border: 'border-secondary/30',
                href: infoData[`email`] ? `mailto:${infoData[`email`]}` : undefined
              },
              { 
                icon: Zap, 
                title: language === 'vi' ? 'Số Điện Thoại' : 'Phone Number', 
                value: infoData[`sodienthoai`], 
                color: 'text-accent-blue', 
                bg: 'bg-accent-blue/10', 
                border: 'border-accent-blue/30',
                href: infoData[`sodienthoai`] ? `tel:${infoData[`sodienthoai`]}` : undefined
              }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                target={item.href?.startsWith('http') ? "_blank" : undefined}
                rel={item.href?.startsWith('http') ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative glass-panel p-8 border-t-2 ${item.border} hover:bg-white/[0.05] transition-all group ${item.href ? 'cursor-pointer hover:border-white/40' : 'cursor-default'}`}
              >
                {item.href && item.href.startsWith('http') && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-40 transition-opacity">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                )}
                <div className={`w-12 h-12 ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-mono text-sm text-foreground/50 uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-foreground font-medium text-lg break-words">{item.value}</p>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Button 
              size="lg" 
              className="clip-edge bg-white text-black hover:bg-gray-200 font-bold px-12 py-8 text-lg rounded-none transition-all duration-300"
                onClick={() => navigate(`/${language}/contact`)} // Điều hướng đến trang /contact
            >
              <span className="flex items-center gap-3">
                <Terminal className="w-5 h-5" />
                {t.contact.cta}
              </span>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer language={language} infoData={infoData} prefixWP={prefixWP} />
    </div>
  );
}
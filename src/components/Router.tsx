import React, { useState, useEffect, lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useParams, useLocation, useNavigate, ScrollRestoration } from 'react-router-dom';
import { motion } from 'framer-motion';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage'; // Keep ErrorPage
import { MemberProvider } from '@/integrations';
import { WPProcessStep, WPComparison, WPInfo, WPTemplate } from '@/entities';
import { HelmetProvider } from 'react-helmet-async';
import NotFoundPage from './pages/NotFoundPage';
import { Loader2 } from 'lucide-react';

// Lazy load các trang để giảm kích thước bundle ban đầu
const HomePage = lazy(() => import('@/components/pages/HomePage'));
const PrivacyPage = lazy(() => import('@/components/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/components/pages/TermsPage'));
const ContactPage = lazy(() => import('@/components/pages/ContactPage'));
const AboutPage = lazy(() => import('@/components/pages/AboutPage'));
const ProductListPage = lazy(() => import('@/components/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/components/pages/ProductDetailPage'));
const TemplatePage = lazy(() => import('@/components/pages/TemplatePage'));
const TemplateDetailPage = lazy(() => import('@/components/pages/TemplateDetailPage'));

interface AppRouterProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
  data_privacy?: any; // Thêm thuộc tính data_privacy vào interface
  data_terms?: any;
  data_about_me?: any;
  data_products?: any[];
  data_templates?: WPTemplate[];
  basename?: string; // Thêm prop này để kiểm soát URL gốc
}

// Hiệu ứng loading trang chuyên nghiệp hơn
const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
    <div className="relative">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse rounded-full" />
    </div>
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[10px] tracking-[0.3em] text-primary/70 uppercase animate-pulse">
        Synchronizing Data...
      </span>
      <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  </div>
);

// Layout component that includes ScrollToTop
function LayoutWithLanguage() {
  const { lang } = useParams<{ lang: 'vi' | 'en' }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Default language if not specified in URL
  const currentLang: 'vi' | 'en' = lang === 'vi' || lang === 'en' ? lang : 'vi'; // Default to 'vi'

  // Function to change language and navigate
  const setLanguage = (newLang: 'vi' | 'en') => {
    const pathSegments = location.pathname.split('/').filter(Boolean); // Remove empty strings
    if (pathSegments[0] === 'vi' || pathSegments[0] === 'en') {
      pathSegments[0] = newLang; // Replace existing language segment
    } else {
      pathSegments.unshift(newLang); // Add language segment if not present
    }
    navigate(`/${pathSegments.join('/')}${location.search}${location.hash}`, { preventScrollReset: true });
  };

  // Kết thúc hiệu ứng loading khi đã chuyển trang thành công
  useEffect(() => {
    window.dispatchEvent(new Event('app:nav-end'));
  }, [location.pathname]);

  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<PageLoader />}>
        <Outlet context={{ language: currentLang, setLanguage }} />
      </Suspense>
    </>
  );
}

function LanguageGuard({ children, ...props }: { children: React.ReactNode } & AppRouterProps) {
  const { lang } = useParams<{ lang: string }>();

  // Nếu lang không phải vi hoặc en, chặn lại và trả về NotFoundPage luôn
  if (lang !== 'vi' && lang !== 'en') {
    return <NotFoundPage {...props} />;
  }

  // Nếu hợp lệ, cho phép hiển thị Component con (ở đây là HomePage)
  return <>{children}</>;
}

const getRouterConfig = (props: AppRouterProps) => ([
  { // Route configuration
    path: "/", 
    element: <LayoutWithLanguage />, // Use the new layout component
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/vi" replace />, // Redirect root to default language
      },
      {
        path: ":lang", // Route for language prefix
        element: (
          <LanguageGuard {...props}>
            <HomePage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/privacy",
        element: (
          <LanguageGuard {...props}>
            <PrivacyPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/terms",
        element: (
          <LanguageGuard {...props}>
            <TermsPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/contact",
        element: (
          <LanguageGuard {...props}>
            <ContactPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/about",
        element: (
          <LanguageGuard {...props}>
            <AboutPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/products",
        element: (
          <LanguageGuard {...props}>
            <ProductListPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/products/:slug",
        element: (
          <LanguageGuard {...props}>
            <ProductDetailPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/templates",
        element: (
          <LanguageGuard {...props}>
            <TemplatePage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/templates/:id",
        element: (
          <LanguageGuard {...props}>
            <TemplateDetailPage {...props} />
          </LanguageGuard>
        ),
      },
      {
        path: ":lang/*", 
        element: <NotFoundPage {...props} />,
      },
      {
        path: "*", 
        element: <NotFoundPage {...props} />,
      }
    ],
  },
]);

export default function AppRouter(props: AppRouterProps) {
  const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);

  useEffect(() => {
    // Ưu tiên basename từ props (cho bản nháp), nếu không có mới dùng env
    const routerInstance = createBrowserRouter(getRouterConfig(props), {
      basename: props.basename || import.meta.env.BASE_NAME || '/',
    });
    setRouter(routerInstance);
  }, [props]); // `props` ở đây là dữ liệu tĩnh từ Astro, nên `useEffect` chỉ chạy 1 lần

  if (!router) {
    return (
      <PageLoader />
    );
  }

  return (
    <HelmetProvider>
      <MemberProvider>
        <RouterProvider router={router} />
      </MemberProvider>
    </HelmetProvider>
  );
}

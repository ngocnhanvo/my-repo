import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useParams, useLocation, useNavigate, ScrollRestoration } from 'react-router-dom';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage'; // Keep ErrorPage
import HomePage from '@/components/pages/HomePage';
import PrivacyPage from '@/components/pages/PrivacyPage';
import TermsPage from '@/components/pages/TermsPage';
import ContactPage from '@/components/pages/ContactPage';
import AboutPage from '@/components/pages/AboutPage';
import ProductListPage from '@/components/pages/ProductListPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { WPProcessStep, WPComparison, WPInfo } from '@/entities';
import { HelmetProvider } from 'react-helmet-async';
import NotFoundPage from './pages/NotFoundPage';

interface AppRouterProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
  data_privacy?: any; // Thêm thuộc tính data_privacy vào interface
  data_terms?: any;
  data_about_me?: any;
  data_products?: any[];
  basename?: string; // Thêm prop này để kiểm soát URL gốc
}

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

  return (
    <>
      <ScrollRestoration />
      <Outlet context={{ language: currentLang, setLanguage }} /> {/* Pass language and setLanguage via context */}
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
    return null; // Không render gì cho đến khi router được khởi tạo trên client
  }

  return (
    <HelmetProvider>
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
    </HelmetProvider>
  );
}

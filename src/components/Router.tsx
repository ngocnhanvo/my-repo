import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { WPProcessStep, WPComparison, WPInfo } from '@/entities';

interface AppRouterProps {
  data_process_steps: WPProcessStep[];
  data_compre: WPComparison[];
  data_info: WPInfo[];
  WC_URL: string;
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
    navigate(`/${pathSegments.join('/')}${location.search}${location.hash}`);
  };

  return (
    <>
      <ScrollToTop />
      <Outlet context={{ language: currentLang, setLanguage }} /> {/* Pass language and setLanguage via context */}
    </>
  );
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
        element: <HomePage {...props} />,
      },
      {
        path: ":lang/*", // Catch-all for other paths with language prefix
        element: <HomePage {...props} />, // Or a more specific component if needed
      },
      // Fallback for paths without language prefix, redirect to default language
      {
        path: "*",
        element: <Navigate to="/vi" replace />,
      },
    ],
  },
]);

export default function AppRouter(props: AppRouterProps) {
  const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);

  useEffect(() => {
    // Khởi tạo router chỉ khi component đã mount trên client
    const routerInstance = createBrowserRouter(getRouterConfig(props), {
      basename: import.meta.env.BASE_NAME,
    });
    setRouter(routerInstance);
  }, [props]); // `props` ở đây là dữ liệu tĩnh từ Astro, nên `useEffect` chỉ chạy 1 lần

  if (!router) {
    return null; // Không render gì cho đến khi router được khởi tạo trên client
  }

  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}

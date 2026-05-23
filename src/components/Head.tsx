import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import interFont1 from "public/fonts/inter/v20/UcCo3FwrK3iLTcvsYwYZ8UA3J58.woff2";
import interFont2 from "public/fonts/inter/v20/UcCo3FwrK3iLTcvtYwYZ8UA3J58.woff2";
import interFont3 from "public/fonts/inter/v20/UcCo3FwrK3iLTcviYwYZ8UA3.woff2";

export const Head = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
      rel="preload"
        href={interFont1}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      <link
        rel="preload"
        href={interFont2}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      <link
        rel="preload"
        href={interFont3}
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
};

// Thanh progress chạy ở trên đầu khi chuyển trang
export const TopProgressBar = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const start = () => setIsAnimating(true);
    const stop = () => setIsAnimating(false);

    window.addEventListener('app:nav-start', start);
    window.addEventListener('app:nav-end', stop);

    return () => {
      window.removeEventListener('app:nav-start', start);
      window.removeEventListener('app:nav-end', stop);
    };
  }, []);

  return (
    <AnimatePresence mode="popLayout">
      {isAnimating && (
        <motion.div
          initial={{ scaleX: 0.1, opacity: 1 }}
          animate={{ scaleX: 0.8 }} // Chạy đến 80% để chờ tải trang
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 1, ease: "linear" }} // Chạy từ từ tạo cảm giác đang tải
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary z-[100] shadow-[0_0_15px_rgba(0,255,204,0.5)]"
        />
      )}
    </AnimatePresence>
  );
}

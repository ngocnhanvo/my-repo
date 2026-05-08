// Ví dụ nội dung file src/entities/wordpress.ts
export interface WPProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  images: Array<{ src: string; alt: string }>;
  // ... các trường khác từ WooCommerce API
}

/** Giao diện bài viết chuẩn từ WordPress */
export interface WPPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  slug: string;
  featured_image?: string;
}

/** Giao diện Quy trình (Custom Post Type) từ WordPress */
export interface WPProcessStep {
  id: number;
  title: string;
  description: string;
  order: number;
  benefit?: string;
  image?: string;
}

/** Giao diện Bảng so sánh từ WordPress */
export interface WPComparison {
  id: number;
  featureName: string;
  featureDescription?: string;
  vibeCodeStudioCapability: string;
  standardWixCapability: string;
  vibeCodeStudioBenefit?: string;
  standardWixLimitation?: string;
}
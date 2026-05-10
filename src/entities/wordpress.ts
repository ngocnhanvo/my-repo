// Ví dụ nội dung file src/entities/wordpress.ts
export interface WPProduct {
  id: number;
  name: string;
  slug?: string;
  price?: string;
  description?: string;
  image?: string;
  images?: Array<{ src: string; alt: string }>;
  // ... các trường khác từ WooCommerce API
  category?: string;
  categoryId?: string;
  categoryImage: string;
  attributes?: { name: string; value: string }[];
  material?: string;
  dimensions?: string;
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
  id?: number;
  tieudechinh?: string;
  en_tieudechinh?: string;
  mota?: string;
  en_mota?: string;
  benefit?: string;
  en_benefit?: string;
  order?: number;
  image?: string;
}

/** Giao diện Bảng so sánh từ WordPress */
export interface WPComparison {
  id: number;
  thongsokythuat?: string;
  chungtoi?: string;
  wix_0?: string;
  en_thongsokythuat?: string;
  en_chungtoi?: string;
  en_wix_0?: string;
  order?: number;
}

/** Giao diện chung */
export interface WPInfo {
  id: number;
  tencongty?: string;
  en_tencongty?: string;
  diachi?: string;
  en_diachi?: string;
  sodienthoai?: string;
  email?: string;
  logo?: string;
  favicon?: string;
}
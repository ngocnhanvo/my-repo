// Ví dụ nội dung file src/entities/wordpress.ts
export interface ProcessedImageResult {
  src: string;     // Đường dẫn ảnh mặc định (bản lớn nhất hoặc ảnh gốc)
  srcSet: string;
  srcSets: {};   // Chuỗi srcSet chứa nhiều kích thước phục vụ responsive
}

export interface WPProduct {
  id: number;
  name: string;
  slug?: string;
  price?: string;
  image?: ProcessedImageResult;
  images?: Array<{ src: string; alt: string }>;
  baseSlug?: string;
  title?: string;
  content?: string;
  description?: string;
  en_title?: string;
  en_content?: string;
  en_description?: string;
  // ... các trường khác từ WooCommerce API
  category?: string;
  categoryId?: string;
  categoryImage: string;
  attributes?: { name: string; value: string }[];
  dimensions?: string;
}

/** Giao diện Mẫu Website */
export interface WPTemplate {
  id?: number;
  name?: string;
  slug?: {};
  title?: {};
  content?: {};
  image?: Record<string, ProcessedImageResult>;
  packageType?: {};
  url?: {};
  price?: {},
  description?: string;
  features?: string[];
  category?: string;
  attributes?: [];
  order?: number;
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
  image?: ProcessedImageResult;
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
  googlemap?: string;
  sodienthoai?: string;
  email?: string;
  domain?: string;
  logo?: ProcessedImageResult;
  favicon?: ProcessedImageResult;
  image?: ProcessedImageResult;
}
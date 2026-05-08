import type { WPPost, WPProcessStep, WPComparison } from './wordpress';

// Re-export các types để các component có thể import đồng nhất từ @/entities
export type { WPPost, WPProcessStep, WPComparison };

// Ghi chú: Logic gọi dữ liệu đã được chuyển sang BaseCrudService tại @/integrationsWP 
// để tuân thủ kiến trúc phân lớp (Entities chỉ chứa kiểu dữ liệu, Integrations chứa logic).

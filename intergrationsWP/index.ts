import type { WPPost, WPProcessStep, WPComparison } from '../src/entities/wordpress';

const API_BASE = '/api/wordpress';

/**
 * Map giữa Collection ID (Wix style) và tham số 'type' của WordPress API Proxy.
 * Giúp bạn giữ nguyên mã nguồn ở UI khi gọi BaseCrudService.getAll('processsteps').
 */
const collectionMap: Record<string, string> = {
  'processsteps': 'process_steps',
  'comparisontable': 'comparison',
  'posts': 'posts'
};

/**
 * BaseCrudService dành riêng cho WordPress/WooCommerce.
 * Cung cấp các phương thức giao tiếp chuẩn hóa với WordPress API Proxy.
 */
export const BaseCrudService = {
  /**
   * Lấy danh sách items từ WordPress.
   * @returns Object chứa mảng items để tương thích với pattern của Wix.
   */
  async getAll<T>(collectionName: string): Promise<{ items: T[] }> {
    const type = collectionMap[collectionName] || collectionName;
    const response = await fetch(`${API_BASE}?type=${type}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[WP BaseCrudService] Failed to fetch ${type}: ${errorText}`);
    }

    const data = await response.json();
    
    return {
      items: Array.isArray(data.items) ? data.items : []
    };
  },

  /**
   * Lấy một mục cụ thể theo ID hoặc Slug.
   */
  async getById<T>(collectionName: string, id: string | number): Promise<T | null> {
    const type = collectionMap[collectionName] || collectionName;
    const response = await fetch(`${API_BASE}?type=${type}&id=${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      const errorText = await response.text();
      throw new Error(`[WP BaseCrudService] Failed to fetch ${type} (ID: ${id}): ${errorText}`);
    }

    return await response.json();
  }
};

// Export toàn bộ các hàm từ woocommerce.ts để quản lý tập trung tại @/integrationsWP
export * from './woocommerce';
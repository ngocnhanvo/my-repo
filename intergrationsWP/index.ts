import type { WPPost, WPProcessStep, WPComparison } from '../src/entities/wordpress';

const API_BASE = '/api/indexServer';

interface WPProcessStepResponse {
  items: WPProcessStep[];
}
/**
 * Map giữa Collection ID (Wix style) và tham số 'type' của WordPress API Proxy.
 * Giúp bạn giữ nguyên mã nguồn ở UI khi gọi BaseCrudService.getAll('processsteps').
 */


/**
 * BaseCrudService dành riêng cho WordPress/WooCommerce.
 * Cung cấp các phương thức giao tiếp chuẩn hóa với WordPress API Proxy.
 */
export const BaseCrudService = {
  /**
   * Lấy danh sách items từ WordPress.
   * @returns Object chứa mảng items để tương thích với pattern của Wix.
   */
  async get_WPProcessSteps<T extends WPProcessStep[]>(queryParams: string = ''): Promise<T> {
    try {
      const response = await fetch(`${API_BASE}?type=process_steps&${queryParams}`);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to load WPProcessSteps: ${response.status} ${response.statusText} - ${errorBody}`);
      }
      const json = (await response.json()) as WPProcessStepResponse;
      return json.items as T;
    } catch (error) {
      console.error(`❌ LỖI nghiêm trọng khi fetch WPProcessSteps từ CMS:`, error);
      throw error; // Re-throw to fail the build
    }
  },
  async get_WPComparison<T extends WPComparison[]>(queryParams: string = ''): Promise<T> {

    return [{}] as T;
  }
};

// Export toàn bộ các hàm từ woocommerce.ts để quản lý tập trung tại @/integrationsWP
export * from './woocommerce';
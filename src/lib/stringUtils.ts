/**
 * Escape các ký tự đặc biệt trong HTML để tránh lỗi định dạng và bảo vệ XSS
 */
import he from 'he';
export const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const stripHtmlAndUnescape = (html: string): string => {
  if (!html) return '';
  // 1. Loại bỏ các thẻ HTML bằng Regex
  const regexStripHtml = /<[^>]*>?/gm;
  const plainText = html.replace(regexStripHtml, '');

  // 2. Giải mã các kí tự đặc biệt (entities) như &#34;, &nbsp;...
  return he.decode(plainText).replace(/\s+/g, ' ').trim();
};

/**
 * Thay thế các placeholder {key} bằng giá trị thực tế từ một object dữ liệu
 */
export const resolvePlaceholders = (text: string, data: any): string => {
  if (!text) return '';
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    const value = data[key];
    // Trước khi trả về, chúng ta escape giá trị để an toàn khi đưa vào HTML
    return value !== undefined ? escapeHtml(String(value)) : match;
  });
};

/**
 * Định dạng số thành chuỗi tiền tệ VNĐ.
 * @param amount Số tiền cần định dạng.
 * @returns Chuỗi tiền tệ đã định dạng (ví dụ: "1.000.000 VNĐ").
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return ''; // Trả về chuỗi rỗng nếu không phải là số hợp lệ
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getPrivacyPage() { // Renamed function to match file name
  if (!WC_URL) {
    console.error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables.');
    return { title: '', content: '', en_title: '', en_content: '' };
  }

  try {
    // Fetch trang chính sách bảo mật tiếng Việt
    const viResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=privacy-policy&_embed=true`);
    const viPages = viResponse.ok ? await viResponse.json() : [];
    const viPage = viPages.length > 0 ? viPages[0] : null;

    // Fetch trang chính sách bảo mật tiếng Anh
    const enResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=en_privacy-policy&_embed=true`);
    const enPages = enResponse.ok ? await enResponse.json() : [];
    const enPage = enPages.length > 0 ? enPages[0] : null;

    return {
      // Nội dung tiếng Việt
      title: viPage?.title?.rendered || '',
      content: viPage?.content?.rendered || '',
      // Nội dung tiếng Anh (từ trang riêng)
      en_title: enPage?.title?.rendered || '',
      en_content: enPage?.content?.rendered || '',
    };
  } catch (error) {
    console.error(`❌ LỖI fetch Privacy Policy:`, error);
    // Trả về đối tượng rỗng để tránh lỗi undefined trong các component React
    return { title: '', content: '', en_title: '', en_content: '' };
  }
}
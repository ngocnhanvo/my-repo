const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getAboutPage() {
  if (!WC_URL) {
    throw new Error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables. Không thể fetch About Page.');
  }

  try {
    // Fetch trang giới thiệu tiếng Việt (slug: about-me)
    const viResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=about-me&_embed=true`);
    if (!viResponse.ok) {
      const errorText = await viResponse.text();
      throw new Error(`❌ LỖI fetch About Page (VI) từ CMS: ${viResponse.status} ${viResponse.statusText} - ${errorText}`);
    }
    const viPages = await viResponse.json();
    const viPage = viPages.length > 0 ? viPages[0] : null;

    // Fetch trang giới thiệu tiếng Anh (slug: en_about-me)
    const enResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=en_about-me&_embed=true`);
    if (!enResponse.ok) {
      const errorText = await enResponse.text();
      throw new Error(`❌ LỖI fetch About Page (EN) từ CMS: ${enResponse.status} ${enResponse.statusText} - ${errorText}`);
    }
    const enPages = await enResponse.json();
    const enPage = enPages.length > 0 ? enPages[0] : null;

    return {
      // Trả về cấu trúc phẳng y hệt trang chính sách
      title: viPage?.title?.rendered || '',
      content: viPage?.content?.rendered || '',
      en_title: enPage?.title?.rendered || '',
      en_content: enPage?.content?.rendered || '',
    };
  } catch (error) {
    console.error(`❌ LỖI nghiêm trọng khi fetch About Page từ CMS:`, error);
    throw error; // Re-throw the error to ensure the build fails.
  }
}

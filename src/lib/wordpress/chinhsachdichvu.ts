const WC_URL = import.meta.env.WC_URL || process.env.WC_URL;

export async function getTermsPage() { // Keep getTermsPage export
  if (!WC_URL) {
    console.error('❌ LỖI: Biến WC_URL chưa được cấu hình trong Environment Variables.');
    return { title: '', content: '', en_title: '', en_content: '' };
  }

  try {
    // Fetch trang điều khoản dịch vụ tiếng Việt
    const viResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=terms-service&_embed=true`);
    const viPages = viResponse.ok ? await viResponse.json() : [];
    const viPage = viPages.length > 0 ? viPages[0] : null;

    // Fetch trang điều khoản dịch vụ tiếng Anh
    const enResponse = await fetch(`${WC_URL}/wp-json/wp/v2/pages?slug=en_terms-service&_embed=true`);
    const enPages = enResponse.ok ? await enResponse.json() : [];
    const enPage = enPages.length > 0 ? enPages[0] : null;

    return {
      title: viPage?.title?.rendered || 'Điều Khoản Dịch Vụ',
      content: viPage?.content?.rendered || '',
      en_title: enPage?.title?.rendered || 'Terms of Service',
      en_content: enPage?.content?.rendered || '',
    };
  } catch (error) {
    console.error(`❌ LỖI fetch Terms Page:`, error);
    return { title: '', content: '', en_title: '', en_content: '' };
  }
}
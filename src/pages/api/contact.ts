import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => { // Keep POST export
  try {
    const body = await request.json();
    const { name, phone, email, message, toEmail, companyName } = body;

    // Bạn cần cài đặt biến môi trường RESEND_API_KEY trên Cloudflare Dashboard
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    const recipient = toEmail || "contact@vibecodestudio.com"; // Ưu tiên email từ client, fallback nếu cần

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
        to: recipient,
        cc: email ? [email] : undefined,
        subject: `[${companyName || 'Vibe Code'}] Yêu cầu từ khách hàng: ${name}`,
        html: `
          <h3>Thông tin liên hệ mới</h3>
          <p><strong>Họ tên:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          ${email ? `<p><strong>Email khách hàng:</strong> ${email}</p>` : ''}
          <p><strong>Nội dung:</strong></p>
          <p>${message}</p>
        `,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    } else {
      const errorData = await res.json(); // Đọc phản hồi lỗi từ Resend
      console.error('Resend API Error:', res.status, errorData); // Log lỗi chi tiết
      return new Response(JSON.stringify({ error: 'Failed to send', details: errorData }), { status: 500 });
    }
  } catch (error) {
    console.error('API Contact Catch Error:', error); // Log lỗi trong khối catch
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Server Error' }), { status: 500 });
  }
};

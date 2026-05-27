import type { APIRoute } from 'astro';
import { getAvas } from '@/lib/avas_env';
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => { // Keep POST export
  try {
    const body = await request.json();
    const { turnstileToken, name, phone, email, message, toEmail, companyName, domain } = body;
    const avas = getAvas(locals);
    // Bạn cần cài đặt biến môi trường RESEND_API_KEY trên Cloudflare Dashboard
    const runtime = (locals as any).runtime;
    const env = runtime?.env;
    //const RESEND_API_KEY = env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || '';
    //const TURNSTILE_SECRET_KEY = env.CLOUDFLARE_TURNSTILE_SECRET_KEY || import.meta.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '';
    
    // 1. Xác thực Cloudflare Turnstile trước khi làm bất cứ việc gì khác
    if (avas.TURNSTILE_SECRET_KEY) {
      const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: avas.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        console.warn('⚠️ Cảnh báo: Phát hiện yêu cầu spam hoặc Captcha không hợp lệ.');
        return new Response(JSON.stringify({ error: 'Security verification failed' }), { status: 403 });
      }
    }

    const recipient = toEmail || "contact@vibecodestudio.com"; // Ưu tiên email từ client, fallback nếu cần
    const fromEmail = `Trợ lý NVN<troly@${domain}>`; // Định dạng email người gửi

    if (!avas.RESEND_API_KEY) {
      console.error('❌ LỖI: Biến RESEND_API_KEY chưa được cấu hình trong Environment Variables. Không thể gửi email.');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${avas.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail, // Sử dụng email người gửi đã định dạng
        to: recipient,
        cc: email ? [email] : undefined,
        subject: `[${companyName || 'Vibe Code'}] Yêu cầu từ khách hàng "${name}"`,
        html: `
          <h3>Thông tin liên hệ của khách hàng</h3>
          <p><strong>Họ tên:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          ${email ? `<p><strong>Email khách hàng:</strong> ${email}</p>` : ''}
          <p><strong>Nội dung tin nhắn:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    } else {
      const errorData = await res.json(); // Đọc phản hồi lỗi từ Resend
      console.error('Resend API Error:', res.status, errorData); // Log lỗi chi tiết
      return new Response(JSON.stringify({ error: 'Failed to send', details: errorData + fromEmail }), { status: 500 });
    }
  } catch (error) {
    console.error('API Contact Catch Error:', error); // Log lỗi trong khối catch
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Server Error' }), { status: 500 });
  }
};

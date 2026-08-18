import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Common Email Header Component
const getEmailHeader = (title: string, subtitle?: string) => `
  <div style="text-align: center; margin-bottom: 30px;">
    <!-- Logo Badge -->
    <div style="display: inline-block; padding: 12px 28px; border-radius: 16px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.15); margin-bottom: 20px;">
      <span style="font-size: 32px; font-weight: 900; letter-spacing: 2px; color: #ffffff; font-family: 'Segoe UI', Tahoma, sans-serif;">
        O<span style="color: #d4af37;">R</span>IGINAL
      </span>
      <div style="font-size: 9px; font-weight: 700; letter-spacing: 4px; color: #94a3b8; text-transform: uppercase; margin-top: 2px;">
        Luxury Car Care
      </div>
    </div>
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 900; margin: 0 0 8px 0; letter-spacing: -0.5px;">${title}</h1>
    ${subtitle ? `<p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">${subtitle}</p>` : ''}
  </div>
`;

// Common Email Footer Component
const getEmailFooter = () => `
  <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #e2e8f0; text-align: center;">
    <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.6;">
      مركز <strong>أورجينال (ORIGINAL)</strong> لفرش السيارات الفاخر والعناية الشاملة.<br/>
      العنوان: مصر - خدمة عملاء على مدار الساعة
    </p>
    <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
      &copy; ${new Date().getFullYear()} ORIGINAL Auto Care. جميع الحقوق محفوظة.
    </p>
  </div>
`;

// Main Container Wrapper
const wrapEmailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Original Auto Care</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            <!-- Top Gold Accent Bar -->
            <tr>
              <td height="6" style="background: linear-gradient(90deg, #b48e4b 0%, #d4af37 50%, #b48e4b 100%);"></td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export const sendOTPEmail = async (to: string, code: string) => {
  const htmlContent = `
    ${getEmailHeader('رمز التحقق الخاص بك', 'استخدم الرمز التالي لتأكيد هويتك والوصول إلى حسابك')}
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 30px 20px; text-align: center; border: 2px dashed #d4af37; margin: 25px 0;">
      <p style="font-size: 13px; color: #64748b; margin: 0 0 12px 0; font-weight: 700;">كود الأمان المؤقت (OTP)</p>
      <div style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #0f172a; font-family: Consolas, Monaco, monospace; padding-left: 12px; margin: 0;">
        ${code}
      </div>
    </div>
    
    <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 16px; border-radius: 14px; margin-bottom: 25px;">
      <p style="font-size: 13px; color: #854d0e; margin: 0; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
        ⏳ تنبيه: هذا الرمز صالح للاستخدام لمرة واحدة ولمدة 10 دقائق فقط.
      </p>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.6; text-align: center; margin: 0;">
      إذا لم تقم بطلب هذا الكود، يرجى تجاهل هذه الرسالة أو التواصل مع الدعم الفني فوراً لحماية حسابك.
    </p>

    ${getEmailFooter()}
  `;

  const mailOptions = {
    from: `"Original Auto Care" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🔐 رمز التحقق: ${code} - Original`,
    html: wrapEmailTemplate(htmlContent),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send OTP email", error);
  }
};

export const sendStatusUpdateEmail = async (
  to: string, 
  type: 'ORDER' | 'BOOKING', 
  id: string, 
  newStatus: string
) => {
  const isOrder = type === 'ORDER';
  const typeLabel = isOrder ? 'طلبك' : 'حجزك';
  const idLabel = isOrder ? 'رقم الطلب' : 'رقم الحجز';
  
  const htmlContent = `
    ${getEmailHeader(`تحديث حالة ${typeLabel}`, `تم تحديث حالة ${typeLabel} الخاص بك بنجاح`)}
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 25px; border: 1px solid #e2e8f0; margin: 25px 0;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; color: #64748b; font-weight: 600;">
            ${idLabel}:
          </td>
          <td align="left" style="padding: 10px 0; border-bottom: 1px dashed #cbd5e1; font-size: 16px; color: #0f172a; font-weight: 900; font-family: monospace;">
            #${id.slice(-8).toUpperCase()}
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 0 0 0; font-size: 14px; color: #64748b; font-weight: 600;">
            الحالة الجديدة:
          </td>
          <td align="left" style="padding: 14px 0 0 0;">
            <span style="background-color: rgba(212, 175, 55, 0.15); color: #b48e4b; padding: 6px 16px; border-radius: 10px; font-size: 14px; font-weight: 800; border: 1px solid rgba(212, 175, 55, 0.3);">
              ${newStatus}
            </span>
          </td>
        </tr>
      </table>
    </div>
    
    <p style="font-size: 14px; color: #475569; margin-bottom: 30px; text-align: center; line-height: 1.6;">
      يمكنك متابعة تفاصيل الفاتورة وحالة الشحن مباشرة عبر حسابك في موقع أورجينال.
    </p>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://original-auto.com/dashboard/profile" style="display: inline-block; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2);">
        عرض التفاصيل في حسابي
      </a>
    </div>

    ${getEmailFooter()}
  `;

  const mailOptions = {
    from: `"Original Auto Care" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📦 تحديث حالة ${typeLabel} #${id.slice(-8).toUpperCase()} - Original`,
    html: wrapEmailTemplate(htmlContent),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send status update email", error);
  }
};

export const sendAccountStatusEmail = async (to: string, status: 'BANNED' | 'ACTIVE', reason?: string) => {
  const isBanned = status === 'BANNED';
  const color = isBanned ? '#ef4444' : '#10b981';
  const title = isBanned ? 'تنبيه هام بشأن حسابك' : 'تم تفعيل حسابك بنجاح';
  const message = isBanned 
    ? 'نأسف لإبلاغك بأنه قد تم تقييد أو تعليق حسابك لدينا لمخالفة شروط الاستخدام.'
    : 'يسعدنا إبلاغك بأنه قد تم تفعيل حسابك بالكامل، ويمكنك الآن التسوق وحجز الخدمات بكل سهولة.';
    
  const htmlContent = `
    ${getEmailHeader(title)}
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 25px; border: 1px solid #e2e8f0; margin: 25px 0;">
      <p style="font-size: 15px; color: #334155; margin: 0; line-height: 1.7; text-align: center;">
        ${message}
      </p>
      ${isBanned && reason ? `
        <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 14px; border-radius: 12px; margin-top: 15px; text-align: center;">
          <p style="color: #991b1b; margin: 0; font-size: 13px; font-weight: bold;">سبب التقييد: ${reason}</p>
        </div>
      ` : ''}
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://original-auto.com/contact" style="display: inline-block; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 14px; font-weight: 800; font-size: 14px;">
        التواصل مع الدعم الفني
      </a>
    </div>

    ${getEmailFooter()}
  `;

  const mailOptions = {
    from: `"Original Auto Care" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${title} - Original`,
    html: wrapEmailTemplate(htmlContent),
  };

  try { 
    await transporter.sendMail(mailOptions); 
  } catch (e) { 
    console.error(e); 
  }
};

export const sendGeneralMessageEmail = async (to: string, subject: string, content: string) => {
  const htmlContent = `
    ${getEmailHeader(subject)}
    
    <div style="background-color: #f8fafc; border-radius: 20px; padding: 25px; border: 1px solid #e2e8f0; margin: 25px 0;">
      <div style="font-size: 15px; color: #334155; line-height: 1.8; text-align: right; white-space: pre-wrap;">
        ${content}
      </div>
    </div>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://original-auto.com/" style="display: inline-block; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 14px; font-weight: 800; font-size: 14px;">
        زيارة الموقع الرئيسي
      </a>
    </div>

    ${getEmailFooter()}
  `;

  const mailOptions = {
    from: `"Original Auto Care" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${subject} - Original`,
    html: wrapEmailTemplate(htmlContent),
  };

  try { 
    await transporter.sendMail(mailOptions); 
  } catch (e) { 
    console.error(e); 
  }
};

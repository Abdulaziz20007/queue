const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "mail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: true,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }
  async sendMailActivationCode(toEmail, verification) {
    const baseUrl =
      config.get("api_url") ||
      `http://${config.get("ip_address")}:${config.get("port")}`;
    const url = `${baseUrl}/api/customer/verify/${verification}`;

    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #2d3748; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Navbat Tizimi</h1>
          </div>
          <div style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); padding: 35px; border-radius: 12px; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15); border: 1px solid rgba(255, 255, 255, 0.18);">
            <h2 style="color: #1a202c; text-align: center; margin-bottom: 24px; font-size: 24px; font-weight: 600;">Hisobni Faollashtirish</h2>
            <p style="color: #4a5568; text-align: center; margin-bottom: 35px; font-size: 16px; line-height: 1.6;">Hisobingizni faollashtirish uchun quyidagi tugmani bosing</p>
            <div style="text-align: center;">
              <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);">FAOLLASHTIRISH</a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 25px; color: #718096; font-size: 13px;">
            <p style="margin: 5px 0;">Bu avtomatik xabar. Iltimos, javob qaytarmang.</p>
          </div>
        </div>
      `;

    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Queue akkauntini faollashtirish",
      text: "",
      html: html,
    });
  }
}

module.exports = new MailService();

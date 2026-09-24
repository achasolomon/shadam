import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') || 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: user ? { user, pass } : undefined,
      });
      this.logger.log(`SMTP transport ready (${host}:${port})`);
    } else {
      this.logger.log('SMTP_HOST not set — emails will be logged to console (dev mode)');
    }
  }

  get siteUrl(): string {
    return (
      this.config.get<string>('SITE_URL') ||
      this.config.get<string>('NEXT_PUBLIC_SITE_URL') ||
      'http://localhost:3000'
    );
  }

  get fromAddress(): string {
    return this.config.get<string>('MAIL_FROM') || 'SHEDAM Newsletter <newsletter@shedam.org>';
  }

  async send(message: MailMessage): Promise<{ ok: boolean; mode: 'smtp' | 'dev'; error?: string }> {
    const payload = {
      from: this.fromAddress,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text || this.stripHtml(message.html),
    };

    if (!this.transporter) {
      this.logger.log(`[DEV MAIL] To: ${message.to} | Subject: ${message.subject}`);
      return { ok: true, mode: 'dev' };
    }

    try {
      await this.transporter.sendMail(payload);
      return { ok: true, mode: 'smtp' };
    } catch (err: any) {
      this.logger.error(`Failed to send to ${message.to}: ${err?.message}`);
      return { ok: false, mode: 'smtp', error: err?.message || 'send failed' };
    }
  }

  async sendMany(messages: MailMessage[]): Promise<{ sent: number; failed: number; mode: 'smtp' | 'dev' }> {
    let sent = 0;
    let failed = 0;
    let mode: 'smtp' | 'dev' = this.transporter ? 'smtp' : 'dev';

    for (const msg of messages) {
      const result = await this.send(msg);
      if (result.ok) sent += 1;
      else failed += 1;
      mode = result.mode;
    }

    return { sent, failed, mode };
  }

  welcomeEmail(email: string): MailMessage {
    const site = this.siteUrl;
    const unsubscribeUrl = `${site}/unsubscribe?email=${encodeURIComponent(email)}`;
    return {
      to: email,
      subject: 'You are subscribed to the SHEDAM newsletter',
      html: this.layout(
        'Welcome to the SHEDAM newsletter',
        `
          <p>Thank you for subscribing. You will receive updates on mental health awareness, community programmes and upcoming events.</p>
          <p>You can unsubscribe at any time:</p>
          <p><a href="${unsubscribeUrl}">Unsubscribe from this newsletter</a></p>
        `,
        unsubscribeUrl,
      ),
    };
  }

  newsletterEmail(email: string, subject: string, messageHtml: string): MailMessage {
    const unsubscribeUrl = `${this.siteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
    return {
      to: email,
      subject,
      html: this.layout(subject, messageHtml, unsubscribeUrl),
    };
  }

  enquiryReplyEmail(to: string, subject: string, bodyParagraphs: string[]): MailMessage {
    const bodyHtml = bodyParagraphs.map((p) => `<p>${this.escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
    return {
      to,
      subject,
      html: this.transactionalLayout(subject, bodyHtml),
    };
  }

  adminInviteEmail(to: string, name: string, inviteUrl: string, expiresAt: Date | null): MailMessage {
    const expiresText = expiresAt
      ? `This link expires on ${expiresAt.toUTCString()}.`
      : 'This link can only be used once.';
    const bodyHtml = `
      <p>Hi ${this.escapeHtml(name)},</p>
      <p>You have been invited to the SHEDAM admin panel. Set your password to activate your account:</p>
      <p style="margin:28px 0;">
        <a href="${inviteUrl}" style="display:inline-block;background:#1A2332;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;">Set Your Password</a>
      </p>
      <p style="font-size:13px;color:#6b7280;">${expiresText}</p>
      <p style="font-size:13px;color:#6b7280;">If the button does not work, copy and paste this link into your browser:</p>
      <p style="font-size:13px;word-break:break-all;"><a href="${inviteUrl}">${inviteUrl}</a></p>
    `;
    return {
      to,
      subject: 'Complete your SHEDAM admin registration',
      html: this.transactionalLayout('Set up your admin account', bodyHtml),
    };
  }

  async sendSms(phone: string, text: string): Promise<{ ok: boolean; mode: 'api' | 'device'; smsLink?: string; error?: string }> {
    const api_url = this.config.get<string>('SMS_API_URL');
    const api_key = this.config.get<string>('SMS_API_KEY');
    const from = this.config.get<string>('SMS_FROM') || 'SHEDAM';

    if (api_url && api_key) {
      try {
        const res = await fetch(api_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${api_key}` },
          body: JSON.stringify({ to: phone, from, text, message: text }),
        });
        if (!res.ok) {
          const errText = await res.text().catch(() => res.statusText);
          this.logger.error(`SMS API failed for ${phone}: ${errText}`);
          return { ok: false, mode: 'api', error: errText || 'sms api error' };
        }
        return { ok: true, mode: 'api' };
      } catch (err: any) {
        this.logger.error(`SMS API error for ${phone}: ${err?.message}`);
        return { ok: false, mode: 'api', error: err?.message || 'sms api error' };
      }
    }

    const encoded = encodeURIComponent(text);
    const digits = phone.replace(/[^\d+]/g, '');
    const smsLink = `sms:${digits}?&body=${encoded}`;
    this.logger.log(`[DEV SMS] To: ${phone} | open device link`);
    return { ok: true, mode: 'device', smsLink };
  }

  private transactionalLayout(title: string, bodyHtml: string): string {
    return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1A2332;padding:24px 32px;">
          <p style="margin:0;color:#88E788;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">SHEDAM Mental Health Initiative</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">${title}</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;color:#374151;font-size:15px;line-height:1.6;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            This is a reply to your enquiry to SHEDAM Mental Health Initiative.<br>
            <a href="${this.siteUrl}/contact" style="color:#6B7280;">Contact us again</a>
            ·
            <a href="${this.siteUrl}" style="color:#6B7280;">Visit our website</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private layout(title: string, bodyHtml: string, unsubscribeUrl: string): string {
    return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1A2332;padding:24px 32px;">
          <p style="margin:0;color:#88E788;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">SHEDAM Mental Health Initiative</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;line-height:1.3;">${title}</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;color:#374151;font-size:15px;line-height:1.6;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            You are receiving this because you subscribed to our newsletter.<br>
            <a href="${unsubscribeUrl}" style="color:#6B7280;">Unsubscribe at any time</a>
            ·
            <a href="${this.siteUrl}" style="color:#6B7280;">Visit our website</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

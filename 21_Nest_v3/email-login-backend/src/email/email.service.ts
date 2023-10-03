import { Inject, Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('email_user'),
        pass: this.configService.get('email_password'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    console.log(this.configService);
    await this.transporter.sendMail({
      from: {
        name: '系统邮件',
        address: this.configService.get('email_user'),
      },
      to,
      subject,
      html,
    });
  }
}

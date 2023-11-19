/*
 * @Author: thunderchen
 * @Date: 2023-11-19 12:04:33
 * @LastEditTime: 2023-11-19 12:24:36
 * @email: 853524319@qq.com
 * @Description: 邮箱服务
 */
import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '853524319@qq.com',
        pass: 'vsbkqpkqgqhabcdh',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预订系统',
        address: '853524319@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}

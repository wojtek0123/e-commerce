import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import * as handlebars from 'handlebars';
import hbs from 'nodemailer-express-handlebars';

@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}

  createEmailTransport() {
    return nodemailer.createTransport({
      host: this.config.get('MAIL_HOST'),
      port: this.config.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendEmail(data: SendEmailDto) {
    const { recipients, subject, text, html } = data;

    const transport = this.createEmailTransport();

    const x = {
      viewEngine: {
        extname: '.handlebars',
        layoutsDir: 'views/email/',
        defaultLayout: 'layout',
      },
      viewPath: 'views/email/',
    };

    transport.use('compile', hbs(x));

    // handlebars.tem

    const options: nodemailer.SendMailOptions = {
      from: this.config.get('MAIL_USER'),
      to: recipients,
      subject,
    };

    try {
      await transport.sendMail(options);

      console.log('Email send successfully');
    } catch (error: unknown) {
      console.log(error);
    }
  }
}

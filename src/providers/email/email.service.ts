import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(mail: string, message: string, subject: string) {
    try {
      const sentMailInfo = await this.mailerService.sendMail({
        from: 'support@nestapp.com',
        to: mail,
        subject: subject,
        html: message,
      });
      return sentMailInfo;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

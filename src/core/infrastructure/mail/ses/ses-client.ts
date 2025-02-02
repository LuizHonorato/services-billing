import MailNotificationOutputPort from '@/core/ports/out/mail-notification.output-port';
import SendMailDTO from '../dtos/send-mail.dto';

export default class SESClient implements MailNotificationOutputPort {
  async sendMail(input: SendMailDTO): Promise<void> {
    const {} = input;

    // `Enviando e-mail para o cliente ${to.name}`;
  }
}

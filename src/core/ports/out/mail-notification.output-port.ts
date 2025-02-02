import SendMailDTO from '@/core/infrastructure/mail/dtos/send-mail.dto';

export default interface MailNotificationOutputPort {
  sendMail(input: SendMailDTO): Promise<void>;
}

import MailNotificationOutputPort from '@/core/ports/out/mail-notification.output-port';

export default class MockMailNotification
  implements MailNotificationOutputPort
{
  sendMail = jest.fn().mockResolvedValue(true);
}

import SESClient from '@/core/infrastructure/mail/ses/ses-client';
import MailNotificationOutputPort from '@/core/ports/out/mail-notification.output-port';
import { container } from 'tsyringe';

container.registerSingleton<MailNotificationOutputPort>(
  'MailNotificationOutputPort',
  SESClient,
);

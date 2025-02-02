interface MailContactDto {
  name: string;
  email: string;
}

export default interface SendMailDTO {
  to: MailContactDto;
  from?: MailContactDto;
  subject: string;
  attachments?: {
    filename: string;
  }[];
}

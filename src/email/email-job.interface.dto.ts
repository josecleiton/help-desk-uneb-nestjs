import { EmailPersonDto } from './dto/email-person.dto';

export interface IEmailJob {
  person: EmailPersonDto;
  view: string;
  subject: string;
  vars: any;
}

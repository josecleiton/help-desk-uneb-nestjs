import { EmailPersonDto } from './dto/email-person.dto';

export interface EmailJob {
  person: EmailPersonDto;
  view: string;
  subject: string;
  vars: any;
}

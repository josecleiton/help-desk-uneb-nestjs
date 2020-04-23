import { OmitType } from '@nestjs/swagger';
import { SignUpDto } from './signup.dto';

export class SignUpAdminDto extends OmitType(SignUpDto, ['cargo']) {}

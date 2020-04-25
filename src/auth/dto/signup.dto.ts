import {
  MinLength,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNumber,
  Length,
} from 'class-validator';
import { SignInDto } from './signin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { nomeMinLength, nomeMaxLength } from '../user.constants';
import { UserRoles } from '../user-roles.enum';
import { telefoneMinLength, emailMinLength } from '../../app.constants';

export class SignUpDto extends SignInDto {
  @IsString()
  @Length(nomeMinLength, nomeMaxLength)
  @ApiProperty({
    description: 'Nome do Usuário',
    minLength: nomeMinLength,
    maxLength: nomeMaxLength,
    type: String,
  })
  nome: string;

  @IsEmail()
  @MinLength(emailMinLength)
  @ApiProperty({
    description: 'Email do Usuário',
    minLength: emailMinLength,
    type: String,
  })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(telefoneMinLength)
  @ApiProperty({
    description: 'Telefone do Usuário',
    minLength: telefoneMinLength,
    type: String,
  })
  telefone: string;

  @IsEnum(UserRoles)
  @ApiProperty({
    description: 'Cargo do Usuário',
    enum: UserRoles,
    type: String,
  })
  cargo: UserRoles;

  @IsNumber()
  @ApiProperty({
    description: 'Setor ao qual o Usuário pertence',
    type: Number,
  })
  setorId: number;
}

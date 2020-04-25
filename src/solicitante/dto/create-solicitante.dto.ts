import {
  IsString,
  MinLength,
  Length,
  IsEmail,
  IsOptional,
} from 'class-validator';
import {
  emailMinLength,
  telefoneMinLength,
  telefoneMaxLength,
} from '../../app.constants';
import { cpfLength } from '../solicitante.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSolicitanteDto {
  @IsString()
  @Length(cpfLength, cpfLength)
  @ApiProperty({
    description: 'CPF do Solicitante',
    type: String,
    minLength: cpfLength,
    maxLength: cpfLength,
  })
  cpf: string;

  @IsEmail()
  @MinLength(emailMinLength)
  @ApiProperty({
    description: 'Email do Solicitante',
    type: String,
    minLength: emailMinLength,
  })
  email: string;

  @IsOptional()
  @IsString()
  @Length(telefoneMinLength, telefoneMaxLength)
  @ApiProperty({
    description: 'Telefone do Solicitante',
    required: false,
    minLength: telefoneMinLength,
    maxLength: telefoneMaxLength,
  })
  telefone?: string;
}

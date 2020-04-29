import { IsNotEmpty, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { nomeMinLength } from '../setor.constants';
import {
  emailMinLength,
  telefoneMinLength,
  telefoneMaxLength,
} from '../../app.constants';

export class CreateSetorDto {
  @IsNotEmpty()
  @MinLength(nomeMinLength)
  @ApiProperty({
    description: 'Nome do Setor',
    minLength: nomeMinLength,
    type: String,
  })
  nome: string;

  @IsNotEmpty()
  @Length(telefoneMinLength, telefoneMaxLength)
  @ApiProperty({
    description: 'Telefone do Setor',
    minLength: telefoneMinLength,
    type: String,
  })
  telefone: string;

  @IsNotEmpty()
  @MinLength(emailMinLength)
  @ApiProperty({
    description: 'Email do Setor',
    minLength: emailMinLength,
    type: String,
  })
  email: string;
}

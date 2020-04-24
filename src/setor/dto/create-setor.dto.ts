import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  telefoneMinLength,
  nomeMinLength,
  emailMinLength,
} from '../setor.constants';

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
  @MinLength(telefoneMinLength)
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

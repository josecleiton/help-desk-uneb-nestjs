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
    minimum: nomeMinLength,
    type: String,
  })
  nome: string;

  @IsNotEmpty()
  @MinLength(telefoneMinLength)
  @ApiProperty({
    description: 'Telefone do Setor',
    minimum: telefoneMinLength,
    type: String,
  })
  telefone: string;

  @IsNotEmpty()
  @MinLength(emailMinLength)
  @ApiProperty({
    description: 'Email do Setor',
    minimum: emailMinLength,
    type: String,
  })
  email: string;
}

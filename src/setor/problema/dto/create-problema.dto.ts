import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { maxTextFieldLength } from '../../../app.constants';

export class CreateProblemaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(maxTextFieldLength)
  @ApiProperty({
    description: 'Descrição do Problema',
    type: String,
    minLength: 1,
    maxLength: maxTextFieldLength,
  })
  descricao: string;
}

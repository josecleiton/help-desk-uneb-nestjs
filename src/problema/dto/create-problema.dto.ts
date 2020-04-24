import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProblemaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição do Problema',
    type: String,
    minLength: 1,
  })
  descricao: string;
}

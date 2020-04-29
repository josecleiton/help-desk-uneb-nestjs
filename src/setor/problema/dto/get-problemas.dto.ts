import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { maxTextFieldLength } from 'src/app.constants';

export class GetProblemasDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(maxTextFieldLength)
  @ApiPropertyOptional({
    description: 'String de busca por Problemas',
    type: String,
    minLength: 1,
    maxLength: maxTextFieldLength,
  })
  search: string;
}

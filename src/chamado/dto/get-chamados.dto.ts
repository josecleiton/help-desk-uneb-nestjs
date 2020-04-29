import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetChamadosDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Número da página',
    type: Number,
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Máximo de Chamados por página',
    type: Number,
  })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Padrão a ser encontrado nos Chamados',
    type: String,
  })
  search?: string;
}

import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetChamadosDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Número da página', type: Number })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Máximo de Chamados por página', type: Number })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Padrão a ser encontrado nos Chamados',
    type: String,
  })
  search?: string;
}

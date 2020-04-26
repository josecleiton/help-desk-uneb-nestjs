import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { AlteracaoStatus } from '../alteracao.status';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlteracaoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Descrição da alteração', type: String })
  descricao?: string;
  @IsEnum(AlteracaoStatus)
  @ApiProperty({
    description: 'Status da Alteração',
    type: String,
    enum: AlteracaoStatus,
  })
  situacao: AlteracaoStatus;

  data = new Date();
}

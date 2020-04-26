import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
  ValidateIf,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AlteracaoStatus } from '../alteracao.status';
import { AlteracaoPriority } from '../alteracao-priority.enum';

class CreateAlteracaoTransferidoDto {
  @ValidateIf(({ setorId, userId }) => !userId || setorId)
  @IsNumber()
  @ApiProperty({ description: 'Id do Setor', type: Number })
  setorId: number;

  @ValidateIf(({ setorId, userId }) => !setorId || userId)
  @IsNumber()
  @ApiProperty({ description: 'Id do Técnico', type: Number })
  userId: number;
}

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

  @IsOptional()
  @IsEnum(AlteracaoPriority)
  @ApiProperty({
    description: `Prioridade da Alteração (se for a última alteração,
    será usada como prioridade do chamado)`,
    type: String,
    enum: AlteracaoPriority,
  })
  prioridade: AlteracaoPriority;

  @ValidateIf(({ situacao }) => situacao === AlteracaoStatus.TRANSFERIDO)
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateAlteracaoTransferidoDto)
  transferido?: CreateAlteracaoTransferidoDto;
}

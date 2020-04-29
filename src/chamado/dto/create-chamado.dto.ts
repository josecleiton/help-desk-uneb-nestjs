import { CreateSolicitanteDto } from '../../solicitante/dto/create-solicitante.dto';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Length,
  ValidateNested,
  IsDefined,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { tomboMinLength, tomboMaxLength } from '../chamado.constants';
import { CreateChamadoTIDto } from './create-chamado-ti.dto';
import { maxTextFieldLength } from '../../app.constants';
export class CreateChamadoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(maxTextFieldLength)
  @ApiProperty({
    description: 'Descrição do Chamado',
    type: String,
    minLength: 1,
    maxLength: maxTextFieldLength,
  })
  descricao: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Sala ou Laboratório',
    type: String,
  })
  sala: string;

  @IsOptional()
  @IsString()
  @Length(tomboMinLength, tomboMaxLength)
  @ApiPropertyOptional({
    description: 'Código de tombo do equipamento em questão',
    minLength: tomboMinLength,
    maxLength: tomboMaxLength,
  })
  tombo: string;

  @IsNumber()
  @ApiProperty({ description: 'Id do Setor', type: Number })
  setorId: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Id do Problema', type: Number })
  problemaId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateChamadoTIDto)
  @ApiPropertyOptional({
    description: 'Chamado TI',
    type: CreateChamadoTIDto,
  })
  ti: CreateChamadoTIDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSolicitanteDto)
  @ApiProperty({
    description: 'Solicitante',
    type: CreateSolicitanteDto,
  })
  solicitante: CreateSolicitanteDto;
}

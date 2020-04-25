import { CreateSolicitanteDto } from '../../solicitante/dto/create-solicitante.dto';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Length,
  ValidateNested,
  IsDefined,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { tomboMinLength, tomboMaxLength } from '../chamado.constants';
import { CreateChamadoTIDto } from './create-chamado-ti.dto';
export class CreateChamadoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descrição do Chamado',
    type: String,
    minLength: 1,
  })
  descricao: string;

  @IsOptional()
  @IsString()
  sala: string;

  @IsOptional()
  @IsString()
  @Length(tomboMinLength, tomboMaxLength)
  @ApiProperty({
    description: 'Código de tombo do equipamento em questão',
    required: false,
    minLength: tomboMinLength,
    maxLength: tomboMaxLength,
  })
  tombo: string;

  @IsNumber()
  setorId: number;

  @IsOptional()
  @IsNumber()
  problemaId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateChamadoDto)
  ti: CreateChamadoTIDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSolicitanteDto)
  solicitante: CreateSolicitanteDto;
}

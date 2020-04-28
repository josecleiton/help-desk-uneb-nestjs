import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsUrl,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChamadoTIDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Software a ser requerido',
    type: String,
    minimum: 1,
  })
  software: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Data de utilização do equipamento',
    type: Date,
  })
  dataUtilizacao?: Date;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Link do Software em questão',
    type: String,
  })
  link?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiPropertyOptional({
    description: 'Plugins do software em questão',
    type: [String],
  })
  plugins?: string[];
}

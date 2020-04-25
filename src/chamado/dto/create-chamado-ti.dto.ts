import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChamadoTIDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Software a ser requerido', type: String })
  software: string;

  @IsDate()
  @ApiProperty({ description: 'Data de utilização do equipamento', type: Date })
  dataUtilizacao: Date;

  @IsUrl()
  @ApiProperty({ description: 'Link do Software em questão', type: String })
  link: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Plugins do software em questão', type: String })
  plugins?: string;
}

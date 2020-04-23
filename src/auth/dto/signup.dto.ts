import {
  MaxLength,
  MinLength,
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { SignInDto } from './signin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { nomeMinLength, nomeMaxLength } from '../user.constants';
import { UserRoles } from '../user-roles.enum';
import { telefoneMinLength, emailMinLength } from 'src/setor/setor.constants';

export class SignUpDto extends SignInDto {
  @IsString()
  @MinLength(nomeMinLength)
  @MaxLength(nomeMaxLength)
  @ApiProperty({
    minimum: nomeMinLength,
    maximum: nomeMaxLength,
    type: String,
  })
  nome: string;

  @IsEmail()
  @MinLength(emailMinLength)
  @ApiProperty({
    minimum: emailMinLength,
    type: String,
  })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(telefoneMinLength)
  @ApiProperty({
    minimum: telefoneMinLength,
    type: String,
  })
  telefone: string;

  @IsEnum(UserRoles)
  @ApiProperty({
    enum: UserRoles,
    type: String,
  })
  cargo: UserRoles;

  @IsNumber()
  @ApiProperty({ type: Number })
  setorId: number;
}

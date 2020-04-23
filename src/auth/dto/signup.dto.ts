import { MaxLength, MinLength, IsString } from 'class-validator';
import { SignInDto } from './signin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { nomeMinLength, nomeMaxLength } from '../user.constants';

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
}

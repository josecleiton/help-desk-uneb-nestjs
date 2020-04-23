import { MaxLength, MinLength, IsString } from 'class-validator';
import {
  usernameMinLength,
  usernameMaxLength,
  passwordMinLength,
} from '../user.constants';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsString()
  @MinLength(usernameMinLength)
  @MaxLength(usernameMaxLength)
  @ApiProperty({
    minimum: usernameMinLength,
    maximum: usernameMaxLength,
    type: String,
  })
  username: string;

  @IsString()
  @MinLength(passwordMinLength)
  @ApiProperty({
    minimum: passwordMinLength,
    type: String,
  })
  password: string;
}

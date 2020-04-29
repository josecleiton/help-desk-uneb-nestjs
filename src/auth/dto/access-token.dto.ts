import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({ description: 'Jwt Token', type: String, minLength: 1 })
  token: string;
}

import { JwtModuleOptions } from '@nestjs/jwt';
import { jwtSecretKey, expiresIn } from '../auth/auth.constants';

export const jwtConfig: JwtModuleOptions = {
  secret: jwtSecretKey,
  signOptions: { expiresIn },
};

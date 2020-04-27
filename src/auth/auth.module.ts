import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { jwtConfig } from '../config/jwt.config';
import { SetorModule } from '../setor/setor.module';
import { JwtWebSocketStrategy } from './jwt-websocket.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => SetorModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtWebSocketStrategy],
  exports: [JwtStrategy, JwtWebSocketStrategy, PassportModule],
})
export class AuthModule {}

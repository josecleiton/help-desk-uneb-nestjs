import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { jwtQueryParameterWebSocket, jwtSecretKey } from './auth.constants';
import { IJwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { WsException } from '@nestjs/websockets';

export const jwtWebSocketStrategyName = 'JwtWebSocketStrategy';

@Injectable()
export class JwtWebSocketStrategy extends PassportStrategy(
  Strategy,
  jwtWebSocketStrategyName,
) {
  private logger = new Logger('JwtWebSocketStrategy');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter(
        jwtQueryParameterWebSocket,
      ),
      secretOrKey: jwtSecretKey,
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      const msg = `Usuário ${username} não encontrado`;
      this.logger.warn(msg);
      throw new WsException(msg);
    }
    return user;
  }
}

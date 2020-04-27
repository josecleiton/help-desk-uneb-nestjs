import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { jwtWebSocketStrategyName } from './jwt-websocket.strategy';

export class JwtWebSocketGuard extends AuthGuard(jwtWebSocketStrategyName) {
  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Solicitante } from './solicitante.entity';

export const GetSolicitante = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Solicitante => {
    const req = ctx.switchToHttp().getRequest();
    return req.solicitante;
  },
);

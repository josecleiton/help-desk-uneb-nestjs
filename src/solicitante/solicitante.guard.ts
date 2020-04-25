import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { SolicitanteService } from './solicitante.service';
import { customSolicitanteAuthHeader } from './solicitante.constants';

@Injectable()
export class SolicitanteGuard implements CanActivate {
  constructor(private solicitanteService: SolicitanteService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const cpf = req.headers[customSolicitanteAuthHeader.toLowerCase()];
    if (!cpf) {
      return false;
    }
    req.solicitante = await this.solicitanteService.getSolicitanteByCPF(cpf);
    return true;
  }
}

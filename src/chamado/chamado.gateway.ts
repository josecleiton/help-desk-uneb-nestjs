import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WsResponse,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger, UseGuards, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { GetChamadosDto } from './dto/get-chamados.dto';
import { GetUserWs } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ChamadoService } from './chamado.service';
import { chamadoSocketEvents } from './chamado.constants';
import { Chamado } from './chamado.entity';
import { JwtWebSocketGuard } from 'src/auth/jwt-websocket.guard';

@WebSocketGateway()
export class ChamadoGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
  private logger = new Logger('ChamadoGateway');

  constructor(private chamadoService: ChamadoService) {}

  afterInit() {
    this.logger.log('Inicializado');
  }

  handleConnection() {
    this.logger.log('Cliente conectado');
  }

  handleDisconnect() {
    this.logger.log('Cliente desconectado');
  }

  @SubscribeMessage(chamadoSocketEvents.getAllChamados)
  @UseGuards(JwtWebSocketGuard)
  async handleGetAllChamados(
    @MessageBody(ValidationPipe)
    getChamadosDto: GetChamadosDto = new GetChamadosDto(),
    @GetUserWs() user: User,
  ): Promise<WsResponse<Pagination<Chamado>>> {
    this.logger.log(`Recebido do cliente: ${JSON.stringify(getChamadosDto)}`);
    const data = await this.chamadoService.getChamadoByUser(
      user,
      getChamadosDto,
    );
    return { event: chamadoSocketEvents.getAllChamadosResponse, data };
  }
}

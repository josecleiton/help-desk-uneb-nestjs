import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WsResponse,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  Logger,
  UseGuards,
  ValidationPipe,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Server, Socket } from 'socket.io';

import { GetChamadosDto } from './dto/get-chamados.dto';
import { GetUserWs } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ChamadoService } from './chamado.service';
import { chamadoSocketEvents, setorChannelPrefix } from './chamado.constants';
import { Chamado } from './chamado.entity';
import { JwtWebSocketGuard } from '../auth/jwt-websocket.guard';
import { WebSocketChannels } from '../util/websocket-channel';

interface UserChamadoDto {
  user: User;
  dto: GetChamadosDto;
}

@Injectable()
@WebSocketGateway()
export class ChamadoGateway implements OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger('ChamadoGateway');
  private readonly channels = new WebSocketChannels<UserChamadoDto>();
  @WebSocketServer() private readonly server: Server;

  constructor(
    @Inject(forwardRef(() => ChamadoService))
    private chamadoService: ChamadoService,
  ) {}

  afterInit() {
    this.logger.log('Inicializado');
  }

  handleDisconnect(client: Socket) {
    this.channels.pop(client.id);
    this.logger.log(`Cliente ${client.id} desconectado`);
  }

  @SubscribeMessage(chamadoSocketEvents.getAllChamados)
  @UseGuards(JwtWebSocketGuard)
  async handleGetAllChamados(
    @MessageBody(new ValidationPipe({ transform: true }))
    getChamadosDto: GetChamadosDto,
    @GetUserWs() user: User,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<Pagination<Chamado>>> {
    this.logger.log(`Recebido do cliente: ${JSON.stringify(getChamadosDto)}`);
    if (user.setorId) {
      const channel = `${setorChannelPrefix}/${user.setorId}`;
      this.channels.push(channel, client.id, { user, dto: getChamadosDto });
      this.logger.log(`Client ${client.id} entrou no canal ${channel}`);
    }
    const data = await this.chamadoService.getChamadoByUser(
      user,
      getChamadosDto,
    );
    return { event: chamadoSocketEvents.getAllChamadosResponse, data };
  }

  async broadcastChamados(setorId: number) {
    const channelId = `${setorChannelPrefix}/${setorId}`;
    const wsChannel = this.channels.get(channelId);
    if (!wsChannel) {
      return;
    }
    const clients = wsChannel.getAll();
    for (let idx = 0; idx < clients.length; ++idx) {
      const {
        id: clientId,
        data: { dto, user },
      } = clients[idx];
      const chamados = await this.chamadoService.getChamadoByUser(user, dto);
      try {
        this.server.to(clientId).emit(channelId, chamados);
      } catch (err) {
        this.logger.warn(
          `Falhou em enviar mensagem para ${
            user.username
          }. Client id: ${clientId}. ${JSON.stringify(err)}`,
        );
      }
    }
  }
}

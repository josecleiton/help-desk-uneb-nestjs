import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { AlteracaoModule } from './alteracao/alteracao.module';
import { SetorModule } from '../setor/setor.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UtilModule } from '../util/util.module';
import { ChamadoService } from './chamado.service';
import { ChamadoController } from './chamado.controller';
import { ChamadoGateway } from './chamado.gateway';
import { SolicitanteModule } from '../solicitante/solicitante.module';
import { ChamadoRepository } from './chamado.repository';
import { ChamadoTIRepository } from './chamado-ti.repository';

import { chamadoQueueConfig } from './chamado.queue.config';
import { ChamadoConsumer } from './chamado.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChamadoRepository, ChamadoTIRepository]),
    SolicitanteModule,
    AlteracaoModule,
    UtilModule,
    SetorModule,
    AuthModule,
    EmailModule,
    BullModule.registerQueue(chamadoQueueConfig),
  ],
  providers: [ChamadoService, ChamadoConsumer, ChamadoGateway],
  controllers: [ChamadoController],
})
export class ChamadoModule {}

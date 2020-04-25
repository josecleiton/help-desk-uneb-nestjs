import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChamadoService } from './chamado.service';
import { ChamadoController } from './chamado.controller';
import { AlteracaoModule } from './alteracao/alteracao.module';
import { SolicitanteModule } from '../solicitante/solicitante.module';
import { ChamadoRepository } from './chamado.repository';
import { ChamadoTIRepository } from './chamado-ti.repository';
import { DatabaseUtilModule } from '../database-util/database-util.module';
import { SetorModule } from '../setor/setor.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SolicitanteModule,
    AlteracaoModule,
    DatabaseUtilModule,
    SetorModule,
    AuthModule,
    TypeOrmModule.forFeature([ChamadoRepository, ChamadoTIRepository]),
  ],
  providers: [ChamadoService],
  controllers: [ChamadoController],
})
export class ChamadoModule {}

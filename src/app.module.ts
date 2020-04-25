import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SetorModule } from './setor/setor.module';
import { dbConfig } from './config/database.config';
import { SolicitanteModule } from './solicitante/solicitante.module';
import { ChamadoModule } from './chamado/chamado.module';
import { DatabaseUtilModule } from './database-util/database-util.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    SetorModule,
    SolicitanteModule,
    ChamadoModule,
    DatabaseUtilModule,
  ],
})
export class AppModule {}

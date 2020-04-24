import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitanteService } from './solicitante.service';
import { SolicitanteRepository } from './solicitante.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitanteRepository])],
  providers: [SolicitanteService],
})
export class SolicitanteModule {}

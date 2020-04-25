import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitanteService } from './solicitante.service';
import { SolicitanteRepository } from './solicitante.repository';
import { SolicitanteGuard } from './solicitante.guard';

@Module({
  imports: [TypeOrmModule.forFeature([SolicitanteRepository])],
  providers: [SolicitanteService, SolicitanteGuard],
  exports: [SolicitanteService, SolicitanteGuard],
})
export class SolicitanteModule {}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitanteRepository } from './solicitante.repository';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { Solicitante } from './solicitante.entity';

@Injectable()
export class SolicitanteService {
  private logger = new Logger('SolicitanteService');

  constructor(
    @InjectRepository(SolicitanteRepository)
    private solicitanteRepository: SolicitanteRepository,
  ) {}

  createSolicitante(
    createSolicitanteDto: CreateSolicitanteDto,
  ): Promise<Solicitante> {
    this.logger.log(
      `Novo Solicitante: ${JSON.stringify(createSolicitanteDto)}`,
    );
    return this.solicitanteRepository.createSolicitante(createSolicitanteDto);
  }
}

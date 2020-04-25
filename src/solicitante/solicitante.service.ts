import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SolicitanteRepository } from './solicitante.repository';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { Solicitante } from './solicitante.entity';
import { QueryRunnerTransaction } from '../database-util/query-runner.factory';

@Injectable()
export class SolicitanteService {
  private logger = new Logger('SolicitanteService');

  constructor(
    @InjectRepository(SolicitanteRepository)
    private solicitanteRepository: SolicitanteRepository,
  ) {}

  createSolicitante(
    createSolicitanteDto: CreateSolicitanteDto,
    transaction?: QueryRunnerTransaction,
  ): Promise<Solicitante> {
    this.logger.log(
      `Novo Solicitante: ${JSON.stringify(createSolicitanteDto)}`,
    );
    return this.solicitanteRepository.createSolicitante(
      createSolicitanteDto,
      transaction,
    );
  }

  async getSolicitanteByCPF(
    cpf: string,
    transaction?: QueryRunnerTransaction,
  ): Promise<Solicitante> {
    const solicitante = transaction
      ? await transaction.manager.findOne(Solicitante, { cpf })
      : await this.solicitanteRepository.findOne({ cpf });
    if (!solicitante) {
      const msg = `Solicitante com CPF: ${cpf} não encontrado.`;
      this.logger.warn(msg);
      throw new NotFoundException(msg);
    }
    return solicitante;
  }

  async findSolicitanteOrCreate(
    createSolicitanteDto: CreateSolicitanteDto,
    transaction?: QueryRunnerTransaction,
  ): Promise<Solicitante> {
    let solicitante: Solicitante;
    try {
      solicitante = await this.getSolicitanteByCPF(
        createSolicitanteDto.cpf,
        transaction,
      );
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
      solicitante = await this.createSolicitante(
        createSolicitanteDto,
        transaction,
      );
    }
    return solicitante;
  }
}

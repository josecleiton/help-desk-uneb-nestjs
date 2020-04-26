import { Repository, EntityRepository } from 'typeorm';
import { Solicitante } from './solicitante.entity';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { QueryRunnerTransaction } from '../util/query-runner.factory';

@EntityRepository(Solicitante)
export class SolicitanteRepository extends Repository<Solicitante> {
  async createSolicitante(
    createSolicitanteDto: CreateSolicitanteDto,
    transaction?: QueryRunnerTransaction,
  ): Promise<Solicitante> {
    const solicitante = this.create();
    Object.assign(solicitante, createSolicitanteDto);
    if (transaction) {
      await transaction.manager.save(solicitante);
    } else {
      await solicitante.save();
    }
    solicitante.chamados = [];
    return solicitante;
  }
}

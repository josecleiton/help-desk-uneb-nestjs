import { Repository, EntityRepository } from 'typeorm';
import { Solicitante } from './solicitante.entity';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { QueryRunnerTransaction } from '../util/query-runner.factory';
import { TypeOrmExceptionFilter } from '../util/typeorm-exception.filter';

@EntityRepository(Solicitante)
export class SolicitanteRepository extends Repository<Solicitante> {
  private readonly context = 'SolicitanteRepository';

  async createSolicitante(
    createSolicitanteDto: CreateSolicitanteDto,
    transaction?: QueryRunnerTransaction,
  ): Promise<Solicitante> {
    const { cpf, email, telefone } = createSolicitanteDto;
    const solicitante = this.create();
    solicitante.cpf = cpf;
    solicitante.email = email;
    solicitante.telefone = telefone || null;
    try {
      if (transaction) {
        await transaction.manager.save(solicitante);
      } else {
        await solicitante.save();
      }
    } catch (err) {
      throw new TypeOrmExceptionFilter(err, this.context);
    }
    solicitante.chamados = [];
    return solicitante;
  }
}

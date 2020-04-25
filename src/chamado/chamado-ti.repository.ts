import { Repository, EntityRepository } from 'typeorm';
import { ChamadoTI } from './chamado-ti.entity';
import { CreateChamadoTIDto } from './dto/create-chamado-ti.dto';
import { QueryRunnerTransaction } from '../database-util/query-runner.factory';

@EntityRepository(ChamadoTI)
export class ChamadoTIRepository extends Repository<ChamadoTI> {
  async createChamadoTI(
    createChamadoTIDto: CreateChamadoTIDto,
    transaction?: QueryRunnerTransaction,
  ): Promise<ChamadoTI> {
    const chamadoTI = this.create();
    Object.assign(chamadoTI, createChamadoTIDto);
    if (transaction) {
      await transaction.manager.save(chamadoTI);
    } else {
      await chamadoTI.save();
    }
    return chamadoTI;
  }
}

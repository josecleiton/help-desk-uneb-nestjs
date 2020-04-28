import { Repository, EntityRepository } from 'typeorm';
import { ChamadoTI } from './chamado-ti.entity';
import { CreateChamadoTIDto } from './dto/create-chamado-ti.dto';
import { QueryRunnerTransaction } from '../util/query-runner.factory';

@EntityRepository(ChamadoTI)
export class ChamadoTIRepository extends Repository<ChamadoTI> {
  async createChamadoTI(
    createChamadoTIDto: CreateChamadoTIDto,
    transaction?: QueryRunnerTransaction,
  ): Promise<ChamadoTI> {
    const { dataUtilizacao, link, plugins, software } = createChamadoTIDto;
    const chamadoTI = this.create();
    chamadoTI.dataUtilizacao = dataUtilizacao;
    chamadoTI.link = link;
    chamadoTI.plugins = plugins;
    chamadoTI.software = software;
    if (transaction) {
      await transaction.manager.save(chamadoTI);
    } else {
      await chamadoTI.save();
    }
    return chamadoTI;
  }
}

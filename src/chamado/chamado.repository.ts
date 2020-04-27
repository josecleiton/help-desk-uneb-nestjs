import { Repository, EntityRepository } from 'typeorm';
import { Chamado } from './chamado.entity';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { QueryRunnerTransaction } from '../util/query-runner.factory';
import { ChamadoTI } from './chamado-ti.entity';
import { Solicitante } from '../solicitante/solicitante.entity';
import { Setor } from '../setor/setor.entity';
import { Problema } from '../setor/problema/problema.entity';
import { getValueAsPromise } from '../util/promise-type.util';

@EntityRepository(Chamado)
export class ChamadoRepository extends Repository<Chamado> {
  async createChamado(
    createChamadoDto: CreateChamadoDto,
    solicitante: Solicitante,
    setor: Setor,
    problema?: Problema,
    chamadoTI?: ChamadoTI,
    transaction?: QueryRunnerTransaction,
  ) {
    const chamado = this.create();
    Object.assign(chamado, createChamadoDto);
    chamado.solicitante = getValueAsPromise<Solicitante>(solicitante);
    chamado.setor = setor;
    chamado.problema = problema || null;
    chamado.ti = chamadoTI || null;
    if (transaction) {
      await transaction.manager.save(chamado);
    } else {
      await chamado.save();
    }
    delete chamado.setor.problemas;
    chamado.alteracoes = [];
    return chamado;
  }

  // async getChamados(
  //   getChamadosByUserDto: GetChamadosByUserDto,
  //   setorId?: number,
  // ): Promise<Chamado[]> {
  //   const {
  //     page,
  //     maxPerPage = maxChamadosPerPage,
  //     search,
  //   } = getChamadosByUserDto;
  //   const query = this.createQueryBuilder('chamado');
  //   if (setorId) {
  //     query.where({ setorId });
  //   }

  //   if (page) {
  //   }

  //   if (search) {
  //     query.andWhere('(chamado.description LIKE :search)', {
  //       search: `%${search}%`,
  //     });
  //   }
  //   const chamados = await query.getMany();
  //   return chamados;
  // }
}

import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chamado } from './chamado.entity';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { Solicitante } from '../solicitante/solicitante.entity';
import { ChamadoRepository } from './chamado.repository';
import { ChamadoTIRepository } from './chamado-ti.repository';
import { QueryRunnerFactory } from '../database-util/query-runner.factory';
import { SolicitanteService } from '../solicitante/solicitante.service';
import { SetorService } from '../setor/setor.service';
import { Problema } from '../setor/problema/problema.entity';
import { AlteracaoService } from './alteracao/alteracao.service';
import { alteracaoDescriptionDefault } from './alteracao/alteracao.constant';
import { AlteracaoStatus } from './alteracao/alteracao.status';
import { User } from '../auth/user.entity';
import { CreateAlteracaoDto } from './alteracao/dto/create-alteracao.dto';

@Injectable()
export class ChamadoService {
  private logger = new Logger('ChamadoService');

  constructor(
    @InjectRepository(ChamadoRepository)
    private chamadoRepository: ChamadoRepository,
    @InjectRepository(ChamadoTIRepository)
    private chamadoTIRepository: ChamadoTIRepository,
    private solicitanteService: SolicitanteService,
    private setorService: SetorService,
    private alteracaoService: AlteracaoService,
    private queryRunnerFactory: QueryRunnerFactory,
  ) {}

  async getChamados(solicitante: Solicitante): Promise<Chamado[]> {
    return this.chamadoRepository.find({
      where: { solicitanteId: solicitante.id },
    });
  }

  async createChamado(createChamadoDto: CreateChamadoDto): Promise<Chamado> {
    const transaction = await this.queryRunnerFactory.createRunnerAndBeginTransaction();
    try {
      const { setorId, problemaId } = createChamadoDto;
      const setor = await this.setorService.getSetorByID(setorId, transaction);
      let problema: Problema;
      if (problemaId) {
        problema = setor.problemas.find(({ id }) => id === problemaId);
        if (!problema) {
          throw new NotFoundException(
            `Problema #${problemaId} não encontrado no Setor #${setorId}`,
          );
        }
      }
      const solicitante = await this.solicitanteService.findSolicitanteOrCreate(
        createChamadoDto.solicitante,
        transaction,
      );
      const chamadoTI = createChamadoDto.ti
        ? await this.chamadoTIRepository.createChamadoTI(
            createChamadoDto.ti,
            transaction,
          )
        : null;
      const chamado = await this.chamadoRepository.createChamado(
        createChamadoDto,
        solicitante,
        setor,
        problema,
        chamadoTI,
        transaction,
      );
      const alteracao = await this.alteracaoService.createAlteracao(
        {
          descricao: alteracaoDescriptionDefault,
          data: new Date(),
          situacao: AlteracaoStatus.ABERTO,
        },
        chamado,
        null,
        transaction,
      );
      chamado.alteracoes.push(alteracao);
      await transaction.commit();
      return chamado;
    } catch (err) {
      await transaction.rollback();
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`${JSON.stringify(err)}`);
      throw new InternalServerErrorException();
    } finally {
      await transaction.release();
    }
  }

  async getChamadoById(id: number, solicitante: Solicitante): Promise<Chamado> {
    const chamado = await this.chamadoRepository.findOne({
      where: { id, solicitanteId: solicitante.id },
    });
    if (!chamado) {
      const msg = `Chamado #${id} não encontrado`;
      this.logger.warn(msg);
      throw new NotFoundException(msg);
    }
    return chamado;
  }

  async updateChamadoSituacao(
    id: number,
    createAlteracaoDto: CreateAlteracaoDto,
    user: User,
  ): Promise<Chamado> {
    const chamado = await this.chamadoRepository.findOne(id);
    if (!chamado) {
      throw new NotFoundException(`Chamado #${id} não encontrado.`);
    }
    const alteracao = await this.alteracaoService.createAlteracao(
      createAlteracaoDto,
      chamado,
      user,
    );
    chamado.alteracoes.push(alteracao);
    return chamado;
  }

  async deleteChamado(id: number, solicitante: Solicitante): Promise<void> {
    const result = await this.chamadoRepository.delete({
      id,
      solicitanteId: solicitante.id,
    });
    if (!result.affected) {
      this.logger.log(
        `Chamado #${id} tentou ser excluído por: ${JSON.stringify(
          solicitante,
        )}`,
      );
      throw new NotFoundException(`Chamado #${id} não encontrado`);
    }
  }
}

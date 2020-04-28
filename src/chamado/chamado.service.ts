import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { Chamado } from './chamado.entity';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { Solicitante } from '../solicitante/solicitante.entity';
import { ChamadoRepository } from './chamado.repository';
import { ChamadoTIRepository } from './chamado-ti.repository';
import {
  QueryRunnerFactory,
  QueryRunnerTransaction,
} from '../util/query-runner.factory';
import { SolicitanteService } from '../solicitante/solicitante.service';
import { SetorService } from '../setor/setor.service';
import { Problema } from '../setor/problema/problema.entity';
import { AlteracaoService } from './alteracao/alteracao.service';
import { alteracaoDescriptionDefault } from './alteracao/alteracao.constant';
import { AlteracaoStatus } from './alteracao/alteracao.status';
import { User } from '../auth/user.entity';
import { CreateAlteracaoDto } from './alteracao/dto/create-alteracao.dto';
import { AlteracaoPriority } from './alteracao/alteracao-priority.enum';
import { Setor } from '../setor/setor.entity';
import { GetChamadosDto } from './dto/get-chamados.dto';
import { maxChamadosPerPage } from './chamado.constants';
import { FindConditions, Like } from 'typeorm';
import { ChamadoGateway } from './chamado.gateway';

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

    private chamadoGateway: ChamadoGateway,
    private queryRunnerFactory: QueryRunnerFactory,
  ) {}

  private getChamados(
    getChamadosDto: GetChamadosDto,
    searchOptions: FindConditions<Chamado>,
  ): Promise<Pagination<Chamado>> {
    const { page = 1, search } = getChamadosDto;
    let { limit = maxChamadosPerPage } = getChamadosDto;
    limit = Math.min(limit, maxChamadosPerPage);
    if (search) {
      searchOptions.descricao = Like(`%${search}%`);
    }
    return paginate<Chamado>(
      this.chamadoRepository,
      { page, limit },
      { where: { ...searchOptions } },
    );
  }

  async getChamadosBySolicitante(
    solicitante: Solicitante,
    getChamadosDto: GetChamadosDto,
  ): Promise<Pagination<Chamado>> {
    return this.getChamados(getChamadosDto, { solicitanteId: solicitante.id });
  }

  async getChamadoByUser(
    user: User,
    getChamadosDto: GetChamadosDto,
  ): Promise<Pagination<Chamado>> {
    const setorId = user.isAdmin() ? null : user.setorId;
    return this.getChamados(getChamadosDto, { setorId });
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
          situacao: AlteracaoStatus.ABERTO,
          prioridade: AlteracaoPriority.MEDIA,
        },
        chamado,
        null,
        transaction,
      );
      chamado.alteracoes.push(alteracao);
      await transaction.commit();
      await this.chamadoGateway.broadcastChamados(chamado.setorId);
      return chamado;
    } catch (err) {
      await transaction.rollback();
      this.logger.error(`createChamado rollback. ${JSON.stringify(err)}`);
      console.log(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException();
    } finally {
      await transaction.release();
    }
  }

  private notFoundMsg(id: number) {
    return `Chamado #${id} não encontrado.`;
  }

  async getChamadoById(id: number, solicitante: Solicitante): Promise<Chamado> {
    const chamado = await this.chamadoRepository.findOne({
      where: { id, solicitanteId: solicitante.id },
    });
    if (!chamado) {
      const msg = this.notFoundMsg(id);
      this.logger.warn(msg);
      throw new NotFoundException(msg);
    }
    return chamado;
  }

  private async getById(
    id: number,
    transaction?: QueryRunnerTransaction,
  ): Promise<Chamado> {
    const chamado = transaction
      ? await transaction.manager.findOne(Chamado, id)
      : await this.chamadoRepository.findOne(id);
    if (!chamado) {
      const msg = this.notFoundMsg(id);
      this.logger.log(msg);
      throw new NotFoundException(msg);
    }
    return chamado;
  }

  async updateChamadoSituacao(
    id: number,
    createAlteracaoDto: CreateAlteracaoDto,
    user: User,
  ): Promise<Chamado> {
    const chamado = await this.getById(id);
    const alteracao = await this.alteracaoService.createAlteracao(
      createAlteracaoDto,
      chamado,
      user,
    );
    chamado.alteracoes.push(alteracao);
    this.logger.log(
      `Situação do Chamado #${id} atualizado pelo Técnico ${user.username}`,
    );
    await this.chamadoGateway.broadcastChamados(chamado.setorId);
    return chamado;
  }

  private async getSetorAndUser(
    setorId: number,
    userId: number,
    transaction: QueryRunnerTransaction,
  ): Promise<{ setor: Setor; user: User }> {
    let setor: Setor;
    let user: User = null;
    if (!setorId) {
      user = await transaction.manager.findOne(User, userId);
      setor = await this.setorService.getSetorByID(user.setorId, transaction);
    } else {
      setor = await this.setorService.getSetorByID(setorId, transaction);
    }
    return { setor, user };
  }

  async transferChamado(
    id: number,
    createAlteracaoDto: CreateAlteracaoDto,
    user: User,
  ): Promise<Chamado> {
    const { transferido } = createAlteracaoDto;
    const transaction = await this.queryRunnerFactory.createRunnerAndBeginTransaction();
    try {
      const chamado = await this.getById(id, transaction);
      if (chamado.ti) {
        throw new ForbiddenException(
          `Chamado do Setor TI não podem ser transferidos`,
        );
      }
      const { setorId, userId } = transferido;
      const { setor, user: userToAttach } = await this.getSetorAndUser(
        setorId,
        userId,
        transaction,
      );
      chamado.user = userToAttach;
      chamado.setor = setor || chamado.setor;
      await transaction.manager.save(chamado);
      const userToAttachMsg = userToAttach
        ? ` Usuário ${userToAttach.username}`
        : '';
      createAlteracaoDto.descricao =
        createAlteracaoDto.descricao ||
        `Chamado ${chamado.id} transferido para o setor ${setor.id}.${userToAttachMsg}`;
      const alteracao = await this.alteracaoService.createAlteracao(
        createAlteracaoDto,
        chamado,
        user,
        transaction,
      );
      await transaction.commit();
      this.logger.log(createAlteracaoDto.descricao);
      chamado.alteracoes.push(alteracao);
      await this.chamadoGateway.broadcastChamados(chamado.setorId);
      return chamado;
    } catch (err) {
      this.logger.error(err);
      await transaction.rollback();
      const isUserFault =
        err instanceof NotFoundException || err instanceof ForbiddenException;
      if (isUserFault) {
        throw err;
      }
      throw new InternalServerErrorException();
    } finally {
      await transaction.release();
    }
  }

  async cancelChamadoSituacao(
    id: number,
    solicitante: Solicitante,
  ): Promise<Chamado> {
    const chamado = await this.getChamadoById(id, solicitante);
    const alteracao = await this.alteracaoService.createAlteracao(
      {
        situacao: AlteracaoStatus.CANCELADO,
        prioridade: null,
      },
      chamado,
    );
    chamado.alteracoes.push(alteracao);
    this.logger.log(`Chamado #${id} cancelado por seu solicitante.`);
    await this.chamadoGateway.broadcastChamados(chamado.setorId);
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

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlteracaoRepository } from './alteracao.repository';
import { Alteracao } from './alteracao.entity';
import { CreateAlteracaoDto } from './dto/create-alteracao.dto';
import { Chamado } from '../chamado.entity';
import { QueryRunnerTransaction } from '../../database-util/query-runner.factory';
import { User } from 'src/auth/user.entity';

@Injectable()
export class AlteracaoService {
  private logger = new Logger('AlteracaoService');

  constructor(
    @InjectRepository(AlteracaoRepository)
    private alteracaoRepository: AlteracaoRepository,
  ) {}

  async createAlteracao(
    createAlteracaoDto: CreateAlteracaoDto,
    chamado: Chamado,
    user?: User,
    transaction?: QueryRunnerTransaction,
  ): Promise<Alteracao> {
    const userLog = user ? ` Técnico: ${user.username}.` : "";
    this.logger.log(
      `Alteracao ${JSON.stringify(createAlteracaoDto)} no Chamado #${
        chamado.id
      } criada.` + userLog
    );
    return this.alteracaoRepository.createAlteracao(
      createAlteracaoDto,
      chamado,
      user,
      transaction,
    );
  }
}

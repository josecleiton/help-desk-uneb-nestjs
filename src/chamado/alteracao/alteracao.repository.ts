import { Repository, EntityRepository } from 'typeorm';
import { Alteracao } from './alteracao.entity';
import { CreateAlteracaoDto } from './dto/create-alteracao.dto';
import { Chamado } from '../chamado.entity';
import { QueryRunnerTransaction } from '../../util/query-runner.factory';
import { ForbiddenException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';

@EntityRepository(Alteracao)
export class AlteracaoRepository extends Repository<Alteracao> {
  async createAlteracao(
    createAlteracaoDto: CreateAlteracaoDto,
    chamado: Chamado,
    user?: User,
    transaction?: QueryRunnerTransaction,
  ): Promise<Alteracao> {
    const { alteracoes } = chamado;
    if (alteracoes && alteracoes.length) {
      const lastAlteracao = alteracoes[alteracoes.length - 1];
      const { situacao: oldSituacao, situacaoStatusChanger } = lastAlteracao;
      const { situacao: newSituacao } = createAlteracaoDto;
      if (!situacaoStatusChanger.change(oldSituacao, newSituacao)) {
        throw new ForbiddenException(
          `Situação não pode mudar de ${oldSituacao} para ${newSituacao}`,
        );
      }
    }
    const alteracao = this.create();
    delete createAlteracaoDto.transferido;
    Object.assign(alteracao, createAlteracaoDto);
    alteracao.chamado = chamado;
    alteracao.user = user;
    alteracao.data = new Date();
    if (transaction) {
      await transaction.manager.save(alteracao);
    } else {
      await alteracao.save();
    }
    delete alteracao.chamado;
    delete alteracao.situacaoStatusChanger;
    return alteracao;
  }
}

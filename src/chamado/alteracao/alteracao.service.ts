import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlteracaoRepository } from './alteracao.repository';
import { Alteracao } from './alteracao.entity';
import { CreateAlteracaoDto } from './dto/create-alteracao.dto';
import { Chamado } from '../chamado.entity';
import { QueryRunnerTransaction } from '../../util/query-runner.factory';
import { User } from '../../auth/user.entity';
import { EmailService } from '../../email/email.service';
import { emailViews } from '../../email/email.constants';
import { AlteracaoStatusSubject } from './alteracao.status';

@Injectable()
export class AlteracaoService {
  private logger = new Logger('AlteracaoService');

  constructor(
    @InjectRepository(AlteracaoRepository)
    private alteracaoRepository: AlteracaoRepository,
    private emailService: EmailService,
  ) {}

  async createAlteracao(
    createAlteracaoDto: CreateAlteracaoDto,
    chamado: Chamado,
    user?: User,
    transaction?: QueryRunnerTransaction,
  ): Promise<Alteracao> {
    const userLog = user ? ` Técnico: ${user.username}.` : '';
    this.logger.log(
      `Alteracao ${JSON.stringify(createAlteracaoDto)} no Chamado #${
        chamado.id
      } criada.` + userLog,
    );
    const alteracao = await this.alteracaoRepository.createAlteracao(
      createAlteracaoDto,
      chamado,
      user,
      transaction,
    );
    await this.alertSolicitante(chamado, alteracao);
    return alteracao;
  }

  async alertSolicitante(chamado: Chamado, alteracao: Alteracao) {
    const { nome, email } = await chamado.solicitante;
    const { color, situacao } = alteracao;
    const subject = new AlteracaoStatusSubject().getSubject(situacao);
    if (!subject) {
      return;
    }
    const { alertSolicitante } = emailViews;
    alertSolicitante.subject = subject;
    await this.emailService.sendEmail({
      person: { nome, email },
      vars: { color, situacao },
      ...alertSolicitante,
    });
  }
}

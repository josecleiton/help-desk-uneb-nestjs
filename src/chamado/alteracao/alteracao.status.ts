import { StatusChanger, StatusGraph } from 'src/status-changer.interface';

export enum AlteracaoStatus {
  ABERTO = 'aberto',
  EM_ATENDIMENTO = 'em atendimento',
  PENDENTE = 'pendente',
  TRANSFERIDO = 'transferido',
  CANCELADO = 'cancelado',
  CONCLUIDO = 'concluido',
}

export class AlteracaoStatusChanger implements StatusChanger<AlteracaoStatus> {
  private readonly stateGraph: StatusGraph = {
    [AlteracaoStatus.ABERTO]: {
      [AlteracaoStatus.EM_ATENDIMENTO]: true,
      [AlteracaoStatus.TRANSFERIDO]: true,
      [AlteracaoStatus.CANCELADO]: true,
    },
    [AlteracaoStatus.EM_ATENDIMENTO]: {
      [AlteracaoStatus.PENDENTE]: true,
      [AlteracaoStatus.TRANSFERIDO]: true,
      [AlteracaoStatus.CONCLUIDO]: true,
    },
    [AlteracaoStatus.TRANSFERIDO]: {
      [AlteracaoStatus.EM_ATENDIMENTO]: true,
    },
    [AlteracaoStatus.PENDENTE]: { [AlteracaoStatus.EM_ATENDIMENTO]: true },
  };
  change(oldStatus: AlteracaoStatus, newStatus: AlteracaoStatus): boolean {
    try {
      return !!this.stateGraph[oldStatus][newStatus];
    } catch (err) {
      return false;
    }
  }
}

export class AlteracaoStatusSubject {
  private statusSubjectMap = {
    [AlteracaoStatus.ABERTO]: 'Chamado Criado!',
    [AlteracaoStatus.CONCLUIDO]: 'Chamado Concluído!',
  };

  getSubject(status: AlteracaoStatus): string {
    if (status === AlteracaoStatus.CANCELADO) {
      return null;
    }
    const subject = this.statusSubjectMap[status];
    return subject || 'Chamado Atualizado';
  }
}

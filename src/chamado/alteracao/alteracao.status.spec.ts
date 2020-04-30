import {
  AlteracaoStatusChanger,
  AlteracaoStatus,
  AlteracaoStatusSubject,
  defaultAlteracaoStatusSubject,
} from './alteracao.status';

describe('AlteracaoStatus', () => {
  describe('AlteracaoStatusChanger', () => {
    let statusChanger: AlteracaoStatusChanger;
    beforeEach(() => {
      statusChanger = new AlteracaoStatusChanger();
    });

    it('should be defined', () => {
      expect(statusChanger).toBeDefined();
    });

    describe('state diagram', () => {
      let atual: AlteracaoStatus;
      beforeEach(() => {
        atual = null;
      });
      describe('state ABERTO', () => {
        beforeEach(() => {
          atual = AlteracaoStatus.ABERTO;
        });

        it('should be ABERTO', () => {
          expect(atual).toEqual(AlteracaoStatus.ABERTO);
        });

        it('to EM_ATENDIMENTO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.EM_ATENDIMENTO,
          );
          expect(result).toEqual(true);
        });

        it('to CANCELADO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CANCELADO);
          expect(result).toEqual(true);
        });

        it('to TRANSFERIDO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.TRANSFERIDO,
          );
          expect(result).toEqual(true);
        });

        it('to PENDENTE', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.PENDENTE);
          expect(result).toEqual(false);
        });

        it('to CONCLUIDO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CONCLUIDO);
          expect(result).toEqual(false);
        });
      });

      describe('state EM_ATENDIMENTO', () => {
        beforeEach(() => {
          atual = AlteracaoStatus.EM_ATENDIMENTO;
        });

        it('should be EM_ATENDIMENTO', () => {
          expect(atual).toEqual(AlteracaoStatus.EM_ATENDIMENTO);
        });

        it('to PENDENTE', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.PENDENTE);
          expect(result).toEqual(true);
        });

        it('to TRANSFERIDO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.TRANSFERIDO,
          );
          expect(result).toEqual(true);
        });

        it('to CONCLUIDO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CONCLUIDO);
          expect(result).toEqual(true);
        });

        it('to ABERTO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.ABERTO);
          expect(result).toEqual(false);
        });

        it('to CANCELADO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CANCELADO);
          expect(result).toEqual(false);
        });
      });

      describe('state PENDENTE', () => {
        beforeEach(() => {
          atual = AlteracaoStatus.PENDENTE;
        });

        it('should be PENDENTE', () => {
          expect(atual).toEqual(AlteracaoStatus.PENDENTE);
        });

        it('to EM_ATENDIMENTO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.EM_ATENDIMENTO,
          );
          expect(result).toEqual(true);
        });

        it('to ABERTO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.ABERTO);
          expect(result).toEqual(false);
        });

        it('to CANCELADO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CANCELADO);
          expect(result).toEqual(false);
        });

        it('to TRANSFERIDO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.TRANSFERIDO,
          );
          expect(result).toEqual(false);
        });

        it('to CONCLUIDO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CONCLUIDO);
          expect(result).toEqual(false);
        });
      });

      describe('state TRANSFERIDO', () => {
        beforeEach(() => {
          atual = AlteracaoStatus.TRANSFERIDO;
        });

        it('should be TRANSFERIDO', () => {
          expect(atual).toEqual(AlteracaoStatus.TRANSFERIDO);
        });

        it('to EM_ATENDIMENTO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.EM_ATENDIMENTO,
          );
          expect(result).toEqual(true);
        });

        it('to ABERTO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.ABERTO);
          expect(result).toEqual(false);
        });

        it('to CANCELADO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CANCELADO);
          expect(result).toEqual(false);
        });

        it('to TRANSFERIDO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.TRANSFERIDO,
          );
          expect(result).toEqual(false);
        });

        it('to CONCLUIDO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CONCLUIDO);
          expect(result).toEqual(false);
        });
      });

      describe('state CANCELADO', () => {
        beforeEach(() => {
          atual = AlteracaoStatus.CANCELADO;
        });

        it('should be CANCELADO', () => {
          expect(atual).toEqual(AlteracaoStatus.CANCELADO);
        });

        it('to EM_ATENDIMENTO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.EM_ATENDIMENTO,
          );
          expect(result).toEqual(false);
        });

        it('to ABERTO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.ABERTO);
          expect(result).toEqual(false);
        });

        it('to CANCELADO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CANCELADO);
          expect(result).toEqual(false);
        });

        it('to TRANSFERIDO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.TRANSFERIDO,
          );
          expect(result).toEqual(false);
        });

        it('to CONCLUIDO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CONCLUIDO);
          expect(result).toEqual(false);
        });
      });

      describe('state CONCLUIDO', () => {
        beforeEach(() => {
          atual = AlteracaoStatus.CONCLUIDO;
        });

        it('should be CONCLUIDO', () => {
          expect(atual).toEqual(AlteracaoStatus.CONCLUIDO);
        });

        it('to EM_ATENDIMENTO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.EM_ATENDIMENTO,
          );
          expect(result).toEqual(false);
        });

        it('to ABERTO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.ABERTO);
          expect(result).toEqual(false);
        });

        it('to CANCELADO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CANCELADO);
          expect(result).toEqual(false);
        });

        it('to TRANSFERIDO', () => {
          const result = statusChanger.change(
            atual,
            AlteracaoStatus.TRANSFERIDO,
          );
          expect(result).toEqual(false);
        });

        it('to CONCLUIDO', () => {
          const result = statusChanger.change(atual, AlteracaoStatus.CONCLUIDO);
          expect(result).toEqual(false);
        });
      });
    });
  });
  describe('alteracaoStatusSubject', () => {
    let statusSubject: AlteracaoStatusSubject;

    beforeEach(() => {
      statusSubject = new AlteracaoStatusSubject();
    });

    it('should be defined', () => {
      expect(statusSubject).toBeDefined();
    });

    it('should return null as status CANCELADO', () => {
      const result = statusSubject.getSubject(AlteracaoStatus.CANCELADO);
      expect(result).toEqual(null);
    });

    it('should return mapped subject to ABERTO', () => {
      const result = statusSubject.getSubject(AlteracaoStatus.ABERTO);
      expect(result).toBeDefined();
      expect(result).not.toEqual(defaultAlteracaoStatusSubject);
    });

    it('should return mapped subject to CONCLUIDO', () => {
      const result = statusSubject.getSubject(AlteracaoStatus.CONCLUIDO);
      expect(result).toBeDefined();
      expect(result).not.toEqual(defaultAlteracaoStatusSubject);
    });

    it('should return default subject as no mapped status has been passed', () => {
      const result = statusSubject.getSubject(AlteracaoStatus.TRANSFERIDO);
      expect(result).toEqual(defaultAlteracaoStatusSubject);
    });
  });
});

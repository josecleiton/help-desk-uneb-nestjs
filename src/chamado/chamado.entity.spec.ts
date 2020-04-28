import { Chamado } from './chamado.entity';
import { Alteracao } from './alteracao/alteracao.entity';
import { AlteracaoStatus } from './alteracao/alteracao.status';
import { AlteracaoPriority } from './alteracao/alteracao-priority.enum';

describe('ChamadoEntity', () => {
  const value = 42;
  let chamado: Chamado;

  beforeEach(() => {
    chamado = new Chamado();
    chamado.id = value;
    chamado.descricao = 'testDescricao';
    chamado.setorId = value;
  });

  it('should be defined', () => {
    expect(chamado).toBeDefined();
  });

  it('priority should return an object', () => {
    const dummyAlteracao = {
      id: value,
      data: new Date(),
      descricao: 'testDescricao',
      situacao: AlteracaoStatus.ABERTO,
      prioridade: null,
      chamadoId: value,
      userId: value,
    } as Alteracao;
    const prioridade = AlteracaoPriority.ALTA;
    const mockAlteracao = {
      ...dummyAlteracao,
      prioridade,
    } as Alteracao;
    chamado.alteracoes = [dummyAlteracao, mockAlteracao, dummyAlteracao];
    expect(chamado.priority).toEqual(prioridade);
  });

  it('priority should return null', () => {
    expect(chamado.priority).toEqual(null);
  });
});

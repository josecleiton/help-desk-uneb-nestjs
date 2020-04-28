import { Alteracao } from './alteracao.entity';
import { AlteracaoStatus } from './alteracao.status';

describe('AlteracaoEntity', () => {
  let alteracao: Alteracao;
  beforeEach(() => {
    alteracao = new Alteracao();
  });

  it('should be defined', () => {
    expect(alteracao).toBeDefined();
  });

  it('should return valid string color', () => {
    alteracao.situacao = AlteracaoStatus.ABERTO;
    const result = alteracao.color;
    expect(result).toBeDefined;
    expect(typeof result === 'string').toEqual(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AlteracaoService } from './alteracao.service';
import { AlteracaoRepository } from './alteracao.repository';

const mockAlteracaoRepository = () => ({ createAlteracao: jest.fn() });

describe('AlteracaoService', () => {
  let alteracaoService;
  let alteracaoRepository;
  const value = 42;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlteracaoService,
        { provide: AlteracaoRepository, useFactory: mockAlteracaoRepository },
      ],
    }).compile();

    alteracaoService = module.get<AlteracaoService>(AlteracaoService);
    alteracaoRepository = module.get<AlteracaoRepository>(AlteracaoRepository);
  });

  it('should be defined', () => {
    expect(alteracaoService).toBeDefined();
  });

  it('createAlteracao', async () => {
    const mockDto = 'testMock';
    const chamado = 'testChamado';
    alteracaoRepository.createAlteracao.mockResolvedValue(value);
    const result = await alteracaoService.createAlteracao(mockDto, chamado);
    expect(alteracaoRepository.createAlteracao).toBeCalledWith(
      mockDto,
      chamado,
      undefined,
      undefined,
    );
    expect(result).toEqual(value);
  });
});

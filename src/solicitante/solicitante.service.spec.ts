import { Test, TestingModule } from '@nestjs/testing';
import { SolicitanteService } from './solicitante.service';
import { SolicitanteRepository } from './solicitante.repository';

const mockSolicitanteRepository = () => ({ createSolicitante: jest.fn() });

describe('SolicitanteService', () => {
  let solicitanteService;
  let solicitanteRepository;
  const value = 42;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolicitanteService,
        {
          provide: SolicitanteRepository,
          useFactory: mockSolicitanteRepository,
        },
      ],
    }).compile();

    solicitanteService = module.get<SolicitanteService>(SolicitanteService);
    solicitanteRepository = module.get<SolicitanteRepository>(
      SolicitanteRepository,
    );
  });

  it('should be defined', () => {
    expect(solicitanteService).toBeDefined();
    expect(solicitanteRepository).toBeDefined();
  });

  it('createSolicitante', async () => {
    const mockDto = {};
    solicitanteRepository.createSolicitante.mockResolvedValue(value);
    const result = await solicitanteService.createSolicitante(mockDto);
    expect(solicitanteRepository.createSolicitante).toBeCalled();
    expect(result).toEqual(value);
  });
});

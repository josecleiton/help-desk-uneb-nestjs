import { Test, TestingModule } from '@nestjs/testing';
import { AlteracaoService } from './alteracao.service';
import { AlteracaoRepository } from './alteracao.repository';
import { EmailService } from '../../email/email.service';

const mockAlteracaoRepository = () => ({ createAlteracao: jest.fn() });
const mockEmailService = () => ({ sendEmail: jest.fn() });

describe('AlteracaoService', () => {
  let alteracaoService;
  let alteracaoRepository;
  let emailService;
  const value = 42;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlteracaoService,
        { provide: AlteracaoRepository, useFactory: mockAlteracaoRepository },
        { provide: EmailService, useFactory: mockEmailService },
      ],
    }).compile();

    alteracaoService = module.get<AlteracaoService>(AlteracaoService);
    alteracaoRepository = module.get<AlteracaoRepository>(AlteracaoRepository);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(alteracaoService).toBeDefined();
  });

  it('createAlteracao', async () => {
    const mockDto = 'testMock';
    const chamado = { solicitante: { nome: 'test', email: 'email' } };
    alteracaoRepository.createAlteracao.mockResolvedValue(value);
    emailService.sendEmail.mockResolvedValue(null);
    const result = await alteracaoService.createAlteracao(mockDto, chamado);
    expect(emailService.sendEmail).toBeCalled();
    expect(alteracaoRepository.createAlteracao).toBeCalledWith(
      mockDto,
      chamado,
      undefined,
      undefined,
    );
    expect(result).toEqual(value);
  });
});

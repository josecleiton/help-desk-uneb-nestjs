import { Test, TestingModule } from '@nestjs/testing';
import { AlteracaoService } from './alteracao.service';
import { AlteracaoRepository } from './alteracao.repository';
import { EmailService } from '../../email/email.service';
import { ForbiddenException } from '@nestjs/common';
import { AlteracaoStatus } from './alteracao.status';

const mockAlteracaoRepository = () => ({ createAlteracao: jest.fn() });
const mockEmailService = () => ({ sendEmail: jest.fn() });

describe('AlteracaoService', () => {
  let alteracaoService;
  let alteracaoRepository;
  let emailService;

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

  describe('createAlteracao', () => {
    let mockDto;
    let chamado;
    let alteracao;

    beforeEach(() => {
      mockDto = 'testMock';
      chamado = { solicitante: { nome: 'test', email: 'email' } };
      alteracao = {
        color: 'testColor',
        situacao: AlteracaoStatus.ABERTO,
      };
    });

    it('should be defined', () => {
      expect(mockDto).toBeDefined();
      expect(chamado).toBeDefined();
    });

    it('succesfully return chamado', async () => {
      alteracaoRepository.createAlteracao.mockResolvedValue(alteracao);
      emailService.sendEmail.mockResolvedValue(null);
      const result = await alteracaoService.createAlteracao(mockDto, chamado);
      expect(emailService.sendEmail).toBeCalled();
      expect(alteracaoRepository.createAlteracao).toBeCalledWith(
        mockDto,
        chamado,
        undefined,
        undefined,
      );
      expect(result).toEqual(alteracao);
    });

    it('throw 403 as setorId is wrong', () => {
      const mockUser = { setorId: 320302, isAdmin: jest.fn() };
      chamado.setorId = 42;
      mockUser.isAdmin.mockReturnValue(false);
      expect(
        alteracaoService.createAlteracao(mockDto, chamado, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

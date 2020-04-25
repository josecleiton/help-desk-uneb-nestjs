import { Test, TestingModule } from '@nestjs/testing';
import { ChamadoService } from './chamado.service';
import { ChamadoRepository } from './chamado.repository';
import { ChamadoTIRepository } from './chamado-ti.repository';
import { SolicitanteService } from '../solicitante/solicitante.service';
import { SetorService } from '../setor/setor.service';
import { QueryRunnerFactory } from '../database-util/query-runner.factory';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AlteracaoService } from './alteracao/alteracao.service';

const mockChamadoRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createChamado: jest.fn(),
});
const mockChamadoTIRepository = () => ({
  createChamadoTI: jest.fn(),
});
const mockSolicitanteService = () => ({
  findSolicitanteOrCreate: jest.fn(),
});
const mockSetorService = () => ({
  getSetorByID: jest.fn(),
});
const mockQueryRunnerFactory = () => ({
  createRunnerAndBeginTransaction: jest.fn(),
});
const mockAlteracaoService = () => ({ createAlteracao: jest.fn() });

const mockSolicitante = { id: 1 };

describe('ChamadoService', () => {
  const value = 42;
  let chamadoService;
  let chamadoRepository;
  let chamadoTIRepository;
  let solicitanteService;
  let setorService;
  let queryRunnerFactory;
  let alteracaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChamadoService,
        { provide: ChamadoRepository, useFactory: mockChamadoRepository },
        { provide: ChamadoTIRepository, useFactory: mockChamadoTIRepository },
        { provide: SolicitanteService, useFactory: mockSolicitanteService },
        { provide: SetorService, useFactory: mockSetorService },
        { provide: QueryRunnerFactory, useFactory: mockQueryRunnerFactory },
        { provide: AlteracaoService, useFactory: mockAlteracaoService },
      ],
    }).compile();

    chamadoService = module.get<ChamadoService>(ChamadoService);
    chamadoRepository = module.get<ChamadoRepository>(ChamadoRepository);
    chamadoTIRepository = module.get<ChamadoTIRepository>(ChamadoTIRepository);
    solicitanteService = module.get<SolicitanteService>(SolicitanteService);
    setorService = module.get<SetorService>(SetorService);
    queryRunnerFactory = module.get<QueryRunnerFactory>(QueryRunnerFactory);
    alteracaoService = module.get<AlteracaoService>(AlteracaoService);
  });

  it('should be defined', () => {
    expect(chamadoService).toBeDefined();
    expect(chamadoRepository).toBeDefined();
    expect(chamadoTIRepository).toBeDefined();
    expect(solicitanteService).toBeDefined();
    expect(setorService).toBeDefined();
    expect(queryRunnerFactory).toBeDefined();
  });

  it('getChamados', async () => {
    chamadoRepository.find.mockResolvedValue(value);
    const result = await chamadoService.getChamados(mockSolicitante);
    expect(chamadoRepository.find).toBeCalled();
    expect(result).toEqual(value);
  });

  describe('getChamadoById', () => {
    const mockSearch = {
      where: { id: 1, solicitanteId: mockSolicitante.id },
    };
    it('return chamado', async () => {
      chamadoRepository.findOne.mockResolvedValue(value);
      const result = await chamadoService.getChamadoById(
        mockSearch.where.id,
        mockSolicitante,
      );
      expect(chamadoRepository.findOne).toBeCalledWith(mockSearch);
      expect(result).toEqual(value);
    });

    it('throw 404 as chamado not found', () => {
      chamadoRepository.findOne.mockResolvedValue(null);
      expect(chamadoRepository.findOne).not.toBeCalled();
      expect(
        chamadoService.getChamadoById(mockSearch.where.id, mockSolicitante),
      ).rejects.toThrow(NotFoundException);
      expect(chamadoRepository.findOne).toBeCalledWith(mockSearch);
    });
  });

  describe('deleteChamado', () => {
    const id = 1;
    it('delete succesfully', async () => {
      chamadoRepository.delete.mockResolvedValue({ affected: 1 });
      await chamadoService.deleteChamado(id, mockSolicitante);
      expect(chamadoRepository.delete).toBeCalled();
    });

    it('throw 404 as none of row was affected', () => {
      chamadoRepository.delete.mockResolvedValue({ affected: 0 });
      expect(chamadoService.deleteChamado(id, mockSolicitante)).rejects.toThrow(
        NotFoundException,
      );
      expect(chamadoRepository.delete).toBeCalled();
    });
  });

  describe('createChamado', () => {
    const transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    };
    let mockDto;
    let setor;
    const chamado = { alteracoes: [] };
    const solicitante = {};
    const alteracao = {};
    beforeEach(() => {
      setor = {};
      queryRunnerFactory.createRunnerAndBeginTransaction.mockResolvedValue(
        transaction,
      );
      transaction.release.mockResolvedValue(null);
      setorService.getSetorByID.mockResolvedValue(setor);
      solicitanteService.findSolicitanteOrCreate.mockResolvedValue(solicitante);
      chamadoRepository.createChamado.mockResolvedValue(chamado);
      alteracaoService.createAlteracao.mockResolvedValue(alteracao);
      mockDto = {
        description: 'testDescription',
        setorId: 1,
        solicitante: {},
      };
    });

    it('createChamadoDto should be defined', () => {
      expect(mockDto).toBeDefined();
      expect(setor).toBeDefined();
    });

    it('create chamado successfully', async () => {
      transaction.commit.mockResolvedValue(null);
      const result = await chamadoService.createChamado(mockDto);
      expect(queryRunnerFactory.createRunnerAndBeginTransaction).toBeCalled();
      expect(setorService.getSetorByID).toBeCalled();
      expect(solicitanteService.findSolicitanteOrCreate).toBeCalled();
      expect(chamadoRepository.createChamado).toBeCalled();
      expect(result).toEqual(chamado);
    });

    it('create chamado ti successfully', async () => {
      const id = 1;
      setor.problemas = [{ id }];
      mockDto.ti = {};
      mockDto.problemaId = id;
      transaction.commit.mockResolvedValue(null);
      chamadoTIRepository.createChamadoTI.mockResolvedValue(mockDto.ti);
      const result = await chamadoService.createChamado(mockDto);
      expect(queryRunnerFactory.createRunnerAndBeginTransaction).toBeCalled();
      expect(setorService.getSetorByID).toBeCalled();
      expect(solicitanteService.findSolicitanteOrCreate).toBeCalled();
      expect(chamadoTIRepository.createChamadoTI).toBeCalled();
      expect(chamadoRepository.createChamado).toBeCalled();
      expect(result).toEqual(chamado);
    });

    it('throw 404 as problema not found in setor', async () => {
      setor.problemas = [];
      mockDto.problemaId = 1;
      transaction.rollback.mockResolvedValue(null);
      expect(chamadoService.createChamado(mockDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(queryRunnerFactory.createRunnerAndBeginTransaction).toBeCalled();
    });

    it('throw 500 as transaction rollback', () => {
      transaction.commit.mockRejectedValue(new Error('testDatabaseError'));
      expect(chamadoService.createChamado(mockDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(queryRunnerFactory.createRunnerAndBeginTransaction).toBeCalled();
    });
  });

  describe('updateChamadoSituacao', () => {
    it('succesfully returns chamado', async () => {
      const mockChamado = { alteracoes: [] };
      const mockAlteracao = { id: 1 };
      chamadoRepository.findOne.mockResolvedValue(mockChamado);
      alteracaoService.createAlteracao.mockResolvedValue(mockAlteracao);
      const result = await chamadoService.updateChamadoSituacao(1, {}, {});
      mockChamado.alteracoes.push(mockAlteracao);
      expect(chamadoRepository.findOne).toBeCalled();
      expect(alteracaoService.createAlteracao).toBeCalled();
      expect(result).toEqual(mockChamado);
    });

    it('throw 404 as chamado not found', () => {
      chamadoRepository.findOne.mockResolvedValue(null);
      expect(chamadoService.updateChamadoSituacao(1, {}, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(chamadoRepository.findOne).toBeCalled();
    });
  });
});

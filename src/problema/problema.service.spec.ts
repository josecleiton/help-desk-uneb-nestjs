import { Test, TestingModule } from '@nestjs/testing';
import { ProblemaService } from './problema.service';
import { ProblemaRepository } from './problema.repository';
import { SetorService } from '../setor/setor.service';
import { NotFoundException } from '@nestjs/common';

const mockProblemaRepository = () => ({
  getProblemas: jest.fn(),
  delete: jest.fn(),
  createProblema: jest.fn(),
});
const mockSetorService = () => ({
  getSetorById: jest.fn(),
});

const mockUser = {
  username: 'testUser',
};

describe('ProblemaService', () => {
  let problemaService;
  let problemaRepository;
  let setorService;
  const value = 42;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProblemaService,
        { provide: ProblemaRepository, useFactory: mockProblemaRepository },
        { provide: SetorService, useFactory: mockSetorService },
      ],
    }).compile();

    problemaService = module.get<ProblemaService>(ProblemaService);
    problemaRepository = module.get<ProblemaRepository>(ProblemaRepository);
    setorService = module.get<SetorService>(SetorService);
  });

  it('should be defined', () => {
    expect(problemaService).toBeDefined();
    expect(problemaRepository).toBeDefined();
    expect(setorService).toBeDefined();
  });

  it('getProblemas', async () => {
    const mockDto = null;
    const setorId = 1;
    problemaRepository.getProblemas.mockResolvedValue(value);
    const result = await problemaService.getProblemas(setorId, mockDto);
    expect(problemaRepository.getProblemas).toBeCalledWith(setorId, mockDto);
    expect(result).toEqual(value);
  });

  describe('getSetor', () => {
    let setor;
    beforeEach(() => {
      setor = { problemas: [] };
      setorService.getSetorById.mockResolvedValue(setor);
    });

    it('createProblema', async () => {
      const mockProblema = 'testProblema';
      const mockDto = {};
      problemaRepository.createProblema.mockResolvedValue(mockProblema);
      const result = await problemaService.createProblema(
        value,
        mockUser,
        mockDto,
      );
      expect(setorService.getSetorById).toBeCalled();
      expect(problemaRepository.createProblema).toBeCalled();
      expect(result).toBe(mockProblema);
    });

    describe('getProblemaById', () => {
      it('succesfully return problema', async () => {
        const problema = { id: value };
        expect(setor.problemas).toBeDefined();
        setor.problemas.push(problema);
        const result = await problemaService.getProblemaById(
          value,
          1,
          mockUser,
        );
        expect(setorService.getSetorById).toBeCalled();
        expect(result).toEqual(problema);
      });

      it('throws 404 as problema not found', () => {
        expect(problemaService.getProblemaById(1, 1, mockUser)).rejects.toThrow(
          NotFoundException,
        );
        expect(setorService.getSetorById).toBeCalled();
      });
    });

    it('updateProblema', async () => {
      const save = jest.fn();
      const problema = { id: value, save };
      const mockUpdateDto = {};
      expect(setor.problemas).toBeDefined();
      setor.problemas.push(problema);
      const result = await problemaService.updateProblema(
        value,
        1,
        mockUser,
        mockUpdateDto,
      );
      expect(setorService.getSetorById).toBeCalled();
      expect(problema.save).toBeCalled();
      expect(result).toEqual(problema);
    });

    describe('deleteProblema', () => {
      const problema = { id: value };
      beforeEach(() => {
        expect(setor.problemas).toBeDefined();
        setor.problemas.push(problema);
      });
      it('succesfully delete problema', async () => {
        const mockDeletedResult = { affected: 1 };
        problemaRepository.delete.mockResolvedValue(mockDeletedResult);
        await problemaService.deleteProblema(value, 1, mockUser);
        expect(setorService.getSetorById).toBeCalled();
        expect(problemaRepository.delete).toBeCalledWith(problema.id);
      });

      it('throws 404 as none of rows was affected', async () => {
        const mockDeletedResult = { affected: 0 };
        problemaRepository.delete.mockResolvedValue(mockDeletedResult);
        expect(problemaRepository.delete).not.toBeCalled();
        expect(
          problemaService.deleteProblema(value, 1, mockUser),
        ).rejects.toThrow(NotFoundException);
        expect(setorService.getSetorById).toBeCalled();
      });
    });
  });
});

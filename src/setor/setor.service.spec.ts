import { Test, TestingModule } from '@nestjs/testing';
import { SetorService } from './setor.service';
import { SetorRepository } from './setor.repository';
import { NotFoundException } from '@nestjs/common';

const mockSetorRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createSetor: jest.fn(),
  updateSetor: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  username: 'testadmin',
  id: 1,
  isAdmin: jest.fn(),
  setor: { id: null },
};

describe('SetorService', () => {
  let service;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetorService,
        { provide: SetorRepository, useFactory: mockSetorRepository },
      ],
    }).compile();

    service = module.get<SetorService>(SetorService);
    repository = module.get<SetorRepository>(SetorRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('getSetors', async () => {
    const value = 43;
    repository.find.mockResolvedValue(value);
    expect(repository.find).not.toBeCalled();
    const result = await service.getSetors();
    expect(repository.find).toBeCalled();
    expect(result).toEqual(value);
  });

  describe('getSetorById', () => {
    const id = 1;
    beforeEach(() => {
      mockUser.isAdmin = jest.fn();
    });

    it('pass an admin and return setor', async () => {
      const value = 42;
      repository.findOne.mockResolvedValue(value);
      mockUser.isAdmin.mockReturnValue(true);
      expect(repository.findOne).not.toBeCalled();
      const result = await service.getSetorById(1, mockUser);
      expect(repository.findOne).toBeCalledWith(1);
      expect(mockUser.isAdmin).toBeCalled();
      expect(result).toEqual(value);
    });

    it('throws a 404 as faces an unauthorized user', () => {
      mockUser.isAdmin.mockReturnValue(false);
      expect(service.getSetorById(id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).not.toBeCalled();
      expect(mockUser.isAdmin).toBeCalled();
    });

    it('throws a 404 as repository return null', () => {
      mockUser.isAdmin.mockReturnValue(true);
      expect(service.getSetorById(id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toBeCalledWith(1);
      expect(mockUser.isAdmin).toBeCalled();
    });
  });

  it('createSetor', async () => {
    const value = 42;
    const mockDto = {
      nome: 'test nome',
      description: 'test description',
    };
    repository.createSetor.mockResolvedValue(value);
    expect(repository.createSetor).not.toBeCalled();
    const result = await service.createSetor(mockDto, mockUser);
    expect(repository.createSetor).toBeCalledWith(mockDto);
    expect(result).toEqual(value);
  });

  it('updateSetor', async () => {
    const value = 42;
    const setor = { nome: 'test' };
    const mockUpdateDto = {
      nome: 'test nome',
      description: 'test description',
    };
    repository.updateSetor.mockResolvedValue(value);
    repository.findOne.mockResolvedValue(setor);
    mockUser.isAdmin.mockReturnValue(true);
    const result = await service.updateSetor(1, mockUpdateDto, mockUser);
    expect(repository.updateSetor).toBeCalledWith(setor, mockUpdateDto);
    expect(result).toEqual(value);
  });

  describe('deleteSetor', () => {
    const id = 1;
    let value;
    it('delete a setor succesfully', async () => {
      value = { affected: 1 };
      repository.delete.mockResolvedValue(value);
      expect(repository.delete).not.toBeCalled();
      await service.deleteSetor(id, mockUser);
      expect(repository.delete).toBeCalledWith(1);
    });

    it('throws 404 because no rows was affected', () => {
      value = { affected: 0 };
      repository.delete.mockResolvedValue(value);
      expect(repository.delete).not.toBeCalled();
      expect(service.deleteSetor(id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).toBeCalledWith(1);
    });
  });
});

import { Test } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { hashSync } from 'bcryptjs';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { mocked } from 'ts-jest/utils';

jest.mock('bcryptjs');
const mockedHashSync = mocked(hashSync);

const mockCredentials = {
  username: 'test',
  password: 'testpassword',
  nome: 'Test Name',
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signup', () => {
      save.mockResolvedValue(null);
      expect(userRepository.signUp(mockCredentials)).resolves.not.toThrow();
    });

    it('throws a conflict exception because username already exists', () => {
      save.mockRejectedValue({ code: '23505', detail: 'Key(username)' });
      expect(userRepository.signUp(mockCredentials)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a internal server error exception because username already exists', () => {
      save.mockRejectedValue({ code: '13505' });
      expect(userRepository.signUp(mockCredentials)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;
    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUsername';
      user.nome = 'test name';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(mockCredentials);
      expect(result).toEqual(user);
    });

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentials);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('returns null as user password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      const result = await userRepository.validateUserPassword(mockCredentials);
      const { password } = mockCredentials;
      expect(user.validatePassword).toHaveBeenCalledWith(password);
      expect(result).toEqual(null);
    });

    describe('hashPassword', () => {
      it('calls bcrypt.hash to generate a hash', async () => {
        const mockHash = 'testHash';
        mockedHashSync.mockImplementation(() => mockHash);
        userRepository.findOne.mockResolvedValue(user);
        const result = await userRepository.hashPassword(
          mockCredentials.password,
        );
        expect(mockedHashSync).toBeCalledWith(mockCredentials.password);
        expect(result).toEqual(mockHash);
      });
    });
  });
});

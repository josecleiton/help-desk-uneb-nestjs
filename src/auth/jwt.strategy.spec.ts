import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});
describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validate and return the user', async () => {
      const user = { username: 'testuser' } as User;
      userRepository.findOne.mockResolvedValue(user);
      const payload = { username: user.username } as JwtPayload;
      const result = await jwtStrategy.validate(payload);
      expect(userRepository.findOne).toHaveBeenCalledWith(payload);
      expect(result).toEqual(user);
    });

    it('unauthorized exception', () => {
      userRepository.findOne.mockResolvedValue(null);
      const payload = { username: 'testuser' } as JwtPayload;
      expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

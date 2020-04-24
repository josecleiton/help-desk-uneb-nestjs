import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { SetorService } from '../setor/setor.service';
import { UserRoles } from './user-roles.enum';
import { JwtPayload } from './jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  signUp: jest.fn(),
  validateUserPassword: jest.fn(),
});

const mockSetorService = () => ({
  getSetorById: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

const mockSignDto = {
  username: 'testadmin',
  password: 'lul',
  nome: 'teste nome',
  setorId: 2,
};

const mockUser = { ...mockSignDto };

describe('AuthService', () => {
  let authService;
  let userRepository;
  let setorService;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: SetorService, useFactory: mockSetorService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    setorService = module.get<SetorService>(SetorService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(setorService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('signup', async () => {
    const setor = 42;
    const value = 24;
    setorService.getSetorById.mockResolvedValue(setor);
    userRepository.signUp.mockResolvedValue(value);
    const result = await authService.signup(mockSignDto, mockUser);
    expect(setorService.getSetorById).toBeCalledWith(
      mockSignDto.setorId,
      mockUser,
    );
    expect(userRepository.signUp).toBeCalledWith(mockSignDto, setor);
    expect(result).toEqual(value);
  });

  it('signupAdmin', async () => {
    const value = 42;
    userRepository.signUp.mockResolvedValue(value);
    const result = await authService.signupAdmin(mockSignDto);
    expect(userRepository.signUp).toBeCalledWith({
      ...mockSignDto,
      cargo: UserRoles.Admin,
    });
    expect(result).toEqual(value);
  });

  describe('signin', () => {
    it('signin succesfully', async () => {
      const mockPayload: JwtPayload = {
        username: mockUser.username,
        nome: mockUser.nome,
      };
      const accessToken = 'testAccessToken';
      userRepository.validateUserPassword.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(accessToken);
      const result = await authService.signin(mockSignDto);
      expect(userRepository.validateUserPassword).toBeCalledWith(mockSignDto);
      expect(jwtService.sign).toBeCalledWith(mockPayload);
      expect(result).toEqual({ accessToken });
    });

    it('validateUserPassword return null then throws 401', () => {
      userRepository.validateUserPassword.mockResolvedValue(null);
      expect(userRepository.validateUserPassword).not.toBeCalled();
      expect(authService.signin(mockSignDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.validateUserPassword).toBeCalledWith(mockSignDto);
    });
  });
});

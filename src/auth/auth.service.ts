import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { IJwtPayload } from './jwt-payload.interface';
import { Manager } from './manager.model';
import { SignUpAdminDto } from './dto/signup-admin.dto';
import { UserRoles } from './user-roles.enum';
import { SetorService } from '../setor/setor.service';
import { AccessTokenDto } from './dto/access-token.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
    private setorService: SetorService,
  ) {}

  async signup(signUpDto: SignUpDto, manager: Manager): Promise<void> {
    const setor = await this.setorService.getSetorById(
      signUpDto.setorId,
      manager,
    );
    this.logger.log(`New User ${signUpDto.username} by ${manager.username}`);
    return this.userRepository.signUp(signUpDto, setor);
  }

  async signupAdmin(signUpDto: SignUpAdminDto): Promise<void> {
    this.logger.log(`New Admin ${signUpDto.username}`);
    return this.userRepository.signUp({ ...signUpDto, cargo: UserRoles.Admin });
  }

  async signin(signInDto: SignInDto): Promise<AccessTokenDto> {
    const user = await this.userRepository.validateUserPassword(signInDto);
    if (!user) {
      throw new UnauthorizedException('invalid password');
    }
    const payload: IJwtPayload = { username: user.username, nome: user.nome };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}

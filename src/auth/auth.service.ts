import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signup(signUpDto: SignUpDto): Promise<void> {
    return this.userRepository.signUp(signUpDto);
  }

  async signin(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(signInDto);
    if (!user) {
      throw new UnauthorizedException('invalid password');
    }
    const payload: JwtPayload = { username: user.username, nome: user.nome};
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}

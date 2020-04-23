import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { GetManager, GetAdmin } from './get-user.decorator';
import { SignUpAdminDto } from './dto/signup-admin.dto';
import { Manager } from './manager.model';
import { Admin } from './admin.model';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard())
  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
    @GetManager() manager: Manager,
  ): Promise<void> {
    return this.authService.signup(signUpDto, manager);
  }

  @UseGuards(AuthGuard())
  @Post('/signup/admin')
  async signUpAdmin(
    @Body(ValidationPipe) signUpAdminDto: SignUpAdminDto,
    @GetAdmin() admin: Admin,
  ): Promise<void> {
    this.logger.log(
      `admin ${admin.username} attempts to create another admin ${signUpAdminDto.username}`,
    );
    return this.authService.signupAdmin(signUpAdminDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signin(signInDto);
  }
}

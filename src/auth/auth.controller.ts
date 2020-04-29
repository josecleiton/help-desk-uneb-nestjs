import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { GetManager, GetAdmin } from './get-user.decorator';
import { SignUpAdminDto } from './dto/signup-admin.dto';
import { Manager } from './manager.model';
import { Admin } from './admin.model';
import { AccessTokenDto } from './dto/access-token.dto';

const mainRoute = 'auth';
@Controller(mainRoute)
@ApiTags(mainRoute)
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard())
  @Post('/cadastrar')
  @ApiOperation({ description: 'Criar Técnico' })
  @ApiCreatedResponse()
  async signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
    @GetManager() manager: Manager,
  ): Promise<void> {
    return this.authService.signup(signUpDto, manager);
  }

  @UseGuards(AuthGuard())
  @Post('/cadastrar/admin')
  @ApiOperation({ description: 'Criar Admin' })
  @ApiBearerAuth()
  @ApiCreatedResponse()
  async signUpAdmin(
    @Body(ValidationPipe) signUpAdminDto: SignUpAdminDto,
    @GetAdmin() admin: Admin,
  ): Promise<void> {
    this.logger.log(
      `admin ${admin.username} attempts to create another admin ${signUpAdminDto.username}`,
    );
    return this.authService.signupAdmin(signUpAdminDto);
  }

  @Post('/login')
  @ApiOperation({ description: 'Logar' })
  @ApiOkResponse({ description: 'Token de Acesso JWT', type: AccessTokenDto })
  async signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<AccessTokenDto> {
    return this.authService.signin(signInDto);
  }
}

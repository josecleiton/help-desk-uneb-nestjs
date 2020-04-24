import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignUpDto } from './dto/signup.dto';
import {
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { typeOrmCodeErrors } from '../app.constants';
import { Setor } from '../setor/setor.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp(signUpDto: SignUpDto, setor: Setor = null): Promise<void> {
    const { password } = signUpDto;
    const user = this.create();
    Object.assign(user, signUpDto);
    user.setor = setor;
    user.password = await this.hashPassword(password);
    try {
      await user.save();
    } catch (err) {
      if (err.code === typeOrmCodeErrors.uniqueConstraint) {
        const { detail } = err;
        const key = detail
          ? detail.substring(detail.indexOf('(') + 1, detail.indexOf(')'))
          : 'key';
        throw new ConflictException(`${key} already exists`);
      } else {
        this.logger.error(err);
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(signInDto: SignInDto): Promise<User | null> {
    const { username, password } = signInDto;
    const user = await this.findOne({ username });
    if (!(user && user.validatePassword(password))) {
      return null;
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password);
  }
}

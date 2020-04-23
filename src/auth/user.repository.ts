import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignUpDto } from './dto/signup.dto';
import { ConflictException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, password, nome} = signUpDto;
    const user = this.create();
    user.username = username;
    user.password = await this.hashPassword(password);
    user.nome = nome;
    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        // duplicate username
        throw new ConflictException('username already exists');
      }
      throw err;
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

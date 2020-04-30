import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Setor } from '../setor/setor.entity';
import { TypeOrmExceptionFilter } from '../util/typeorm-exception.filter';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly context = 'UserRepository';

  async signUp(signUpDto: SignUpDto, setor: Setor = null): Promise<void> {
    const { cargo, email, nome, telefone, username, password } = signUpDto;
    const user = this.create();
    user.cargo = cargo;
    user.email = email;
    user.nome = nome;
    user.telefone = telefone;
    user.username = username;
    user.setor = setor;
    user.password = await this.hashPassword(password);
    try {
      await user.save();
    } catch (err) {
      throw new TypeOrmExceptionFilter(err, this.context);
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

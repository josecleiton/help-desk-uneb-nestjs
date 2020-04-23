import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRoles } from './user-roles.enum';
import { Setor } from '../setor/setor.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nome: string;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  telefone: string;
  @Column()
  cargo: UserRoles;

  @ManyToOne(
    () => Setor,
    setor => setor.users,
    { eager: true },
  )
  setor: Setor;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  isManager(): boolean {
    return this.cargo === UserRoles.Manager || this.isAdmin();
  }

  isAdmin(): boolean {
    return this.cargo === UserRoles.Admin;
  }
}

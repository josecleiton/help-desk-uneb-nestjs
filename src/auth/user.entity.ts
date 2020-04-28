import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRoles } from './user-roles.enum';
import { Setor } from '../setor/setor.entity';
import { Chamado } from '../chamado/chamado.entity';
import { Alteracao } from '../chamado/alteracao/alteracao.entity';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  password: string;

  @Column({ nullable: true })
  telefone: string;

  @Column()
  cargo: UserRoles;

  @Column({ nullable: true })
  setorId: number;

  @OneToMany(
    () => Chamado,
    chamado => chamado.user,
  )
  chamados: Chamado[];
  @OneToMany(
    () => Alteracao,
    alteracao => alteracao.user,
  )
  alteracoes: Alteracao[];

  @ManyToOne(
    () => Setor,
    setor => setor.users,
    { eager: true },
  )
  setor: Setor;

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  isManager(): boolean {
    return this.cargo === UserRoles.Manager || this.isAdmin();
  }

  isAdmin(): boolean {
    return this.cargo === UserRoles.Admin;
  }
}

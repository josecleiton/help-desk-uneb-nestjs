import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../util/base.entity';
import { User } from '../auth/user.entity';
import { Problema } from './problema/problema.entity';
import { Chamado } from '../chamado/chamado.entity';

@Entity()
export class Setor extends BaseEntity {
  @Column({ unique: true })
  nome: string;

  @Column()
  telefone: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(
    () => User,
    user => user.setor,
    { eager: false },
  )
  users: User[];
  @OneToMany(
    () => Problema,
    problema => problema.setor,
    { eager: true },
  )
  problemas: Problema[];
  @OneToMany(
    () => Chamado,
    chamado => chamado.setor,
  )
  chamados: Chamado[];
}

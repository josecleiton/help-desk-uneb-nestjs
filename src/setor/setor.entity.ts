import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Problema } from 'src/problema/problema.entity';

@Entity()
@Unique(['email'])
export class Setor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nome: string;
  @Column()
  telefone: string;
  @Column()
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
}

import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { Chamado } from '../chamado/chamado.entity';

@Entity()
export class Solicitante extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  cpf: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  telefone?: string;

  @OneToMany(
    () => Chamado,
    chamado => chamado.solicitante,
    { eager: true },
  )
  chamados: Chamado[];
}

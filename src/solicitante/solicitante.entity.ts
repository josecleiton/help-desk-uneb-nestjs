import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../util/base.entity';
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

  @Column({ default: 'Usuário' })
  nome: string;

  @OneToMany(
    () => Chamado,
    chamado => chamado.solicitante,
    { eager: true },
  )
  chamados: Chamado[];
}

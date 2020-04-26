import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Setor } from '../setor/setor.entity';
import { Problema } from '../setor/problema/problema.entity';
import { User } from '../auth/user.entity';
import { Solicitante } from '../solicitante/solicitante.entity';
import { Alteracao } from './alteracao/alteracao.entity';
import { ChamadoTI } from './chamado-ti.entity';

@Entity()
export class Chamado extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descricao: string;

  @Column()
  solicitanteId: number;

  @Column()
  setorId: number;

  @Column({ nullable: true })
  problemaId: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  chamadoTiId: number;

  @OneToOne(() => ChamadoTI)
  @JoinColumn()
  ti: ChamadoTI;

  @OneToMany(
    () => Alteracao,
    alteracao => alteracao.chamado,
    { eager: true },
  )
  alteracoes: Alteracao[];

  @ManyToOne(
    () => Setor,
    setor => setor.chamados,
  )
  setor: Setor;
  @ManyToOne(
    () => Problema,
    problema => problema.chamados,
  )
  problema: Problema;
  @ManyToOne(
    () => User,
    user => user.chamados,
  )
  user: User;
  @ManyToOne(
    () => Solicitante,
    solicitante => solicitante.chamados,
  )
  solicitante: Promise<Solicitante>;
}

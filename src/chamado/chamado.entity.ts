import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../util/base.entity';
import { Setor } from '../setor/setor.entity';
import { Problema } from '../setor/problema/problema.entity';
import { User } from '../auth/user.entity';
import { Solicitante } from '../solicitante/solicitante.entity';
import { Alteracao } from './alteracao/alteracao.entity';
import { ChamadoTI } from './chamado-ti.entity';
import { Expose } from 'class-transformer';
import { AlteracaoPriority } from './alteracao/alteracao-priority.enum';

@Entity()
export class Chamado extends BaseEntity {
  @Column({ type: 'text' })
  descricao: string;

  @Column({ nullable: true })
  sala: string;

  @Column({ nullable: true })
  tombo: string;

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

  @Expose()
  get priority(): AlteracaoPriority {
    if (!this.alteracoes || !this.alteracoes.length) {
      return null;
    }
    for (let idx = this.alteracoes.length - 1; idx >= 0; --idx) {
      const alteracao = this.alteracoes[idx];
      if (alteracao.prioridade) {
        return alteracao.prioridade;
      }
    }
  }
}

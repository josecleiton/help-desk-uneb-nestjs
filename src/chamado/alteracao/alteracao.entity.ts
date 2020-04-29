import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../util/base.entity';
import { Chamado } from '../chamado.entity';
import { User } from '../../auth/user.entity';
import { AlteracaoStatus, AlteracaoStatusChanger } from './alteracao.status';
import { AlteracaoPriority } from './alteracao-priority.enum';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Alteracao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: Date;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ default: AlteracaoStatus.ABERTO })
  situacao: AlteracaoStatus;

  @Column({ nullable: true })
  prioridade: AlteracaoPriority;

  @Column()
  chamadoId: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(
    () => Chamado,
    chamado => chamado.alteracoes,
  )
  chamado: Chamado;
  @ManyToOne(
    () => User,
    user => user.alteracoes,
  )
  user: User;

  @Exclude()
  private situacaoColor = {
    [AlteracaoStatus.ABERTO]: 'white',
    [AlteracaoStatus.CANCELADO]: 'red',
    [AlteracaoStatus.CONCLUIDO]: 'green',
    [AlteracaoStatus.EM_ATENDIMENTO]: 'blue',
    [AlteracaoStatus.PENDENTE]: 'yellow',
    [AlteracaoStatus.TRANSFERIDO]: 'orange',
  };

  @Exclude()
  situacaoStatusChanger = new AlteracaoStatusChanger();

  @Expose()
  get color(): string {
    return this.situacaoColor[this.situacao];
  }
}

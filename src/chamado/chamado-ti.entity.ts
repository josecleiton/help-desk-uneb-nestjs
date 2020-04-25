import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
} from 'typeorm';
import { Chamado } from './chamado.entity';

@Entity()
export class ChamadoTI extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  software: string;
  @Column()
  dataUtilizacao: Date;
  @Column({ type: 'text', nullable: true })
  link: string;
  @Column({ type: 'text', nullable: true })
  plugins: string;

  @OneToOne(() => Chamado)
  chamado: Chamado;
}

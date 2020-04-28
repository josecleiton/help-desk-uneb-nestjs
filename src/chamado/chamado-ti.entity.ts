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

  @Column({ nullable: true })
  dataUtilizacao: Date;

  @Column({ type: 'text', nullable: true })
  link: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  plugins: string[];

  @OneToOne(() => Chamado)
  chamado: Chamado;
}

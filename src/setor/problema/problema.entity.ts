import { Column, ManyToOne, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../util/base.entity';
import { Setor } from '../setor.entity';
import { Chamado } from '../../chamado/chamado.entity';

@Entity()
export class Problema extends BaseEntity {
  @Column({ type: 'text' })
  descricao: string;

  @Column()
  setorId: number;

  @ManyToOne(
    () => Setor,
    setor => setor.problemas,
    { eager: false },
  )
  setor: Setor;

  @OneToMany(
    () => Chamado,
    chamado => chamado.problema,
  )
  chamados: Chamado[];
}

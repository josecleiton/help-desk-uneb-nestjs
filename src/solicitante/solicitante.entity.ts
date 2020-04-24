import { BaseEntity, Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Solicitante extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  cpf: string;
  @Column({ unique: true })
  email: string;
  @Column()
  telefone?: string;
}

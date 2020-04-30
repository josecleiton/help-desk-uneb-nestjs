import { EntityRepository, Repository } from 'typeorm';
import { Setor } from './setor.entity';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';
import { TypeOrmExceptionFilter } from '../util/typeorm-exception.filter';

@EntityRepository(Setor)
export class SetorRepository extends Repository<Setor> {
  private readonly context = 'SetorRepository';

  async createSetor(createSetorDto: CreateSetorDto): Promise<Setor> {
    const { nome, telefone, email } = createSetorDto;
    const setor = new Setor();
    setor.nome = nome;
    setor.telefone = telefone;
    setor.email = email;
    try {
      await setor.save();
    } catch (err) {
      throw new TypeOrmExceptionFilter(err, this.context);
    }
    return setor;
  }

  async updateSetor(
    setor: Setor,
    updateSetorDto: UpdateSetorDto,
  ): Promise<Setor> {
    const { nome, telefone } = updateSetorDto;
    setor.nome = nome;
    setor.telefone = telefone;
    try {
      await setor.save();
    } catch (err) {
      throw new TypeOrmExceptionFilter(err, this.context);
    }
    setor.chamados = setor.chamados || [];
    setor.problemas = setor.problemas || [];
    setor.users = setor.users || [];
    return setor;
  }
}

import { Repository, EntityRepository } from 'typeorm';
import { Problema } from './problema.entity';
import { GetProblemasDto } from './dto/get-problemas.dto';
import { CreateProblemaDto } from './dto/create-problema.dto';
import { Setor } from '../setor.entity';

@EntityRepository(Problema)
export class ProblemaRepository extends Repository<Problema> {
  getProblemas(
    setorId: number,
    getProblemasDto: GetProblemasDto,
  ): Promise<Problema[]> {
    const { search } = getProblemasDto;
    const query = this.createQueryBuilder('problema');
    query.where({ setorId });
    if (search) {
      query.andWhere('problema.descricao = :search', {
        search: `%${search}%`,
      });
    }
    return query.getMany();
  }

  async createProblema(
    setor: Setor,
    createProblemaDto: CreateProblemaDto,
  ): Promise<Problema> {
    const { descricao } = createProblemaDto;
    const problema = this.create();
    problema.descricao = descricao;
    problema.setor = setor;
    await problema.save();
    delete problema.setor;
    return problema;
  }
}

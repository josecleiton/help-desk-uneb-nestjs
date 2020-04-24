import { Repository, EntityRepository } from 'typeorm';
import { Problema } from './problema.entity';
import { GetProblemasDto } from './dto/get-problemas.dto';

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
}

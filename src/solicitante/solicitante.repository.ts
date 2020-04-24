import { Repository, EntityRepository } from 'typeorm';
import { Solicitante } from './solicitante.entity';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';

@EntityRepository(Solicitante)
export class SolicitanteRepository extends Repository<Solicitante> {
  async createSolicitante(
    createSolicitanteDto: CreateSolicitanteDto,
  ): Promise<Solicitante> {
    const solicitante = this.create();
    Object.assign(solicitante, createSolicitanteDto);
    await solicitante.save();
    return solicitante;
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SetorService } from '../setor/setor.service';
import { ProblemaRepository } from './problema.repository';
import { Problema } from './problema.entity';
import { Manager } from '../auth/manager.model';
import { CreateProblemaDto } from './dto/create-problema.dto';
import { GetProblemasDto } from './dto/get-problemas.dto';
import { UpdateProblemaDto } from './dto/update-problema.dto';

@Injectable()
export class ProblemaService {
  private logger = new Logger('ProblemaService');

  constructor(
    @InjectRepository(ProblemaRepository)
    private problemaRepository: ProblemaRepository,
    private setorService: SetorService,
  ) {}

  getProblemas(
    setorId: number,
    getProblemasDto: GetProblemasDto,
  ): Promise<Problema[]> {
    this.logger.log(
      `Problemas do Setor #${setorId}. DTO: ${JSON.stringify(getProblemasDto)}`,
    );
    return this.problemaRepository.getProblemas(setorId, getProblemasDto);
  }

  async getProblemaById(
    id: number,
    setorId: number,
    manager: Manager,
  ): Promise<Problema> {
    const setor = await this.setorService.getSetorById(setorId, manager);
    const problema = setor.problemas.find(problema => problema.id === id);
    if (!problema) {
      this.logger.warn(
        `Problema #${id} tentou ser consultado por ${manager.username}`,
      );
      throw new NotFoundException(`Problema #${id} não encontrado.`);
    }
    return problema;
  }

  async createProblema(
    setorId: number,
    manager: Manager,
    createProblemaDto: CreateProblemaDto,
  ): Promise<Problema> {
    const setor = await this.setorService.getSetorById(setorId, manager);
    const problema = await this.problemaRepository.createProblema(
      setor,
      createProblemaDto,
    );
    this.logger.log(
      `Problema ${JSON.stringify(problema)} foi criado por ${manager.username}`,
    );
    return problema;
  }

  async updateProblema(
    id: number,
    setorId: number,
    manager: Manager,
    updateProblemaDto: UpdateProblemaDto,
  ): Promise<Problema> {
    const problema = await this.getProblemaById(id, setorId, manager);
    Object.assign(problema, updateProblemaDto);
    await problema.save();
    this.logger.log(
      `Problema ${JSON.stringify(problema)} foi editado por ${
        manager.username
      }`,
    );
    return problema;
  }

  async deleteProblema(
    id: number,
    setorId: number,
    manager: Manager,
  ): Promise<void> {
    const problema = await this.getProblemaById(id, setorId, manager);
    const result = await this.problemaRepository.delete(problema.id);
    if (!result.affected) {
      this.logger.warn(
        `Problema #${id} tentou ser excluído por ${manager.username}`,
      );
      throw new NotFoundException(`Problema #${id} não encontrado.`);
    }
    this.logger.log(
      `Problema ${JSON.stringify(problema)} foi excluido por ${
        manager.username
      }`,
    );
  }
}

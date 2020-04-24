import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProblemaRepository } from './problema.repository';
import { GetProblemasDto } from './dto/get-problemas.dto';
import { Problema } from './problema.entity';

@Injectable()
export class ProblemaService {
  constructor(
    @InjectRepository(ProblemaRepository)
    private problemaRepository: ProblemaRepository,
  ) {}

  getProblemas(
    setorId: number,
    getProblemsDto: GetProblemasDto,
  ): Promise<Problema[]> {
    return this.problemaRepository.getProblemas(setorId, getProblemsDto);
  }
}

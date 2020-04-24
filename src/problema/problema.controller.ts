import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ProblemaService } from './problema.service';
import { Problema } from './problema.entity';
import { GetProblemasDto } from './dto/get-problemas.dto';

@Controller('setor/:setor_id/problema')
export class ProblemaController {
  constructor(private problemaService: ProblemaService) {}

  @Get()
  getProblemas(
    @Param('setor_id', ParseIntPipe) setorId: number,
    @Query() getProblemasDto: GetProblemasDto,
  ): Promise<Problema[]> {
    return this.problemaService.getProblemas(setorId, getProblemasDto);
  }
}

import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Body,
  Put,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProblemaService } from './problema.service';
import { Problema } from './problema.entity';
import { GetProblemasDto } from './dto/get-problemas.dto';
import { GetManager } from '../../auth/get-user.decorator';
import { Manager } from '../../auth/manager.model';
import { CreateProblemaDto } from './dto/create-problema.dto';
import { UpdateProblemaDto } from './dto/update-problema.dto';

@Controller('setor/:setor_id/problema')
export class ProblemaController {
  constructor(private problemaService: ProblemaService) {}

  @Get()
  getAll(
    @Param('setor_id', ParseIntPipe) setorId: number,
    @Query(ValidationPipe) getProblemasDto: GetProblemasDto,
  ): Promise<Problema[]> {
    return this.problemaService.getProblemas(setorId, getProblemasDto);
  }

  @UseGuards(AuthGuard())
  @Post()
  create(
    @Param('setor_id', ParseIntPipe) setorId: number,
    @Body(ValidationPipe) createProblemaDto: CreateProblemaDto,
    @GetManager() manager: Manager,
  ): Promise<Problema> {
    return this.problemaService.createProblema(
      setorId,
      manager,
      createProblemaDto,
    );
  }

  @UseGuards(AuthGuard())
  @Put('/:id')
  update(
    @Param('setor_id', ParseIntPipe) setorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProblemaDto: UpdateProblemaDto,
    @GetManager() manager: Manager,
  ): Promise<Problema> {
    return this.problemaService.updateProblema(
      id,
      setorId,
      manager,
      updateProblemaDto,
    );
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  delete(
    @Param('setor_id', ParseIntPipe) setorId: number,
    @Param('id', ParseIntPipe) id: number,
    @GetManager() manager: Manager,
  ): Promise<void> {
    return this.problemaService.deleteProblema(id, setorId, manager);
  }
}

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
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { ProblemaService } from './problema.service';
import { Problema } from './problema.entity';
import { GetProblemasDto } from './dto/get-problemas.dto';
import { GetManager } from '../../auth/get-user.decorator';
import { Manager } from '../../auth/manager.model';
import { CreateProblemaDto } from './dto/create-problema.dto';
import { UpdateProblemaDto } from './dto/update-problema.dto';

const mainRoute = 'problema';
const setorIdParam = 'setor_id';
@Controller(`setor/:${setorIdParam}/${mainRoute}`)
@ApiTags(mainRoute)
export class ProblemaController {
  constructor(private problemaService: ProblemaService) {}

  @Get()
  @ApiOperation({ description: 'Consulta todos os Problemas de um Setor' })
  @ApiOkResponse({ description: 'Problemas', type: [Problema] })
  getAll(
    @Param(setorIdParam, ParseIntPipe) setorId: number,
    @Query(ValidationPipe) getProblemasDto: GetProblemasDto,
  ): Promise<Problema[]> {
    return this.problemaService.getProblemas(setorId, getProblemasDto);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Cria Problema em Setor' })
  @ApiCreatedResponse({ description: 'Problema criado', type: Problema })
  create(
    @Param(setorIdParam, ParseIntPipe) setorId: number,
    @Body(ValidationPipe) createProblemaDto: CreateProblemaDto,
    @GetManager() manager: Manager,
  ): Promise<Problema> {
    return this.problemaService.createProblema(
      setorId,
      manager,
      createProblemaDto,
    );
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Atualiza Problema em Setor' })
  @ApiOkResponse({ description: 'Problema atualizado', type: Problema })
  @ApiNotFoundResponse()
  update(
    @Param(setorIdParam, ParseIntPipe) setorId: number,
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

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Deleta Problema em Setor' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  delete(
    @Param(setorIdParam, ParseIntPipe) setorId: number,
    @Param('id', ParseIntPipe) id: number,
    @GetManager() manager: Manager,
  ): Promise<void> {
    return this.problemaService.deleteProblema(id, setorId, manager);
  }
}

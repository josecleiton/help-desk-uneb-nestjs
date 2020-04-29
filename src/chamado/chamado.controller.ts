import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ChamadoService } from './chamado.service';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { SolicitanteGuard } from '../solicitante/solicitante.guard';
import { GetSolicitante } from '../solicitante/get-solicitante.decorator';
import { Solicitante } from '../solicitante/solicitante.entity';
import { Chamado } from './chamado.entity';
import { solicitanteAuthHeaderSwagger } from '../solicitante/solicitante.constants';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateAlteracaoDto } from './alteracao/dto/create-alteracao.dto';
import { AlteracaoStatus } from './alteracao/alteracao.status';
import { GetChamadosDto } from './dto/get-chamados.dto';

const mainRoute = 'chamado';
@Controller(mainRoute)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags(mainRoute)
export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  @Get()
  @UseGuards(SolicitanteGuard)
  @ApiOperation({ description: 'Consulta todos os Chamados de um Solicitante' })
  @ApiOkResponse({
    description: 'Lista de Chamados',
  })
  getAll(
    @GetSolicitante() solicitante: Solicitante,
    @Query(ValidationPipe) getChamadosDto: GetChamadosDto,
  ): Promise<Pagination<Chamado>> {
    return this.chamadoService.getChamadosBySolicitante(
      solicitante,
      getChamadosDto,
    );
  }

  @Get('user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ description: 'Consulta todos os Chamados de um Técnico' })
  @ApiOkResponse({
    description: 'Lista de Chamados',
  })
  getAllByUser(
    @Query(ValidationPipe) getChamadosByUserDto: GetChamadosDto,
    @GetUser() user: User,
  ): Promise<Pagination<Chamado>> {
    return this.chamadoService.getChamadoByUser(user, getChamadosByUserDto);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ description: 'Cria Chamado' })
  @ApiCreatedResponse({ description: 'Chamado criado', type: Chamado })
  async create(
    @Body(ValidationPipe) createChamadoDto: CreateChamadoDto,
  ): Promise<Chamado> {
    return this.chamadoService.createChamado(createChamadoDto);
  }

  @Get(':id')
  @UseGuards(SolicitanteGuard)
  @ApiHeader(solicitanteAuthHeaderSwagger)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Consulta um Chamado de um Solicitante' })
  @ApiOkResponse({ type: Chamado })
  @ApiNotFoundResponse()
  getById(
    @Param('id', ParseIntPipe) id: number,
    @GetSolicitante() solicitante: Solicitante,
  ): Promise<Chamado> {
    return this.chamadoService.getChamadoById(id, solicitante);
  }

  @Put(':id/situacao')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ description: 'Altera a Situação de um Chamado' })
  @ApiOkResponse({ type: Chamado })
  @ApiNotFoundResponse()
  updateSituacao(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body(ValidationPipe) createAlteracaoDto: CreateAlteracaoDto,
  ): Promise<Chamado> {
    const { situacao } = createAlteracaoDto;
    return situacao !== AlteracaoStatus.TRANSFERIDO
      ? this.chamadoService.updateChamadoSituacao(id, createAlteracaoDto, user)
      : this.chamadoService.transferChamado(id, createAlteracaoDto, user);
  }

  @Delete(':id')
  @UseGuards(SolicitanteGuard)
  @ApiHeader(solicitanteAuthHeaderSwagger)
  @ApiOperation({ description: 'Altera a Situação do Chamado para CANCELADO' })
  @ApiOkResponse({ type: Chamado })
  @ApiNotFoundResponse()
  delete(
    @Param('id', ParseIntPipe) id: number,
    @GetSolicitante() solicitante: Solicitante,
  ): Promise<Chamado> {
    return this.chamadoService.cancelChamadoSituacao(id, solicitante);
  }
}

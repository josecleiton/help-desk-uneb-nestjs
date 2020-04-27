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
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
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

@Controller('chamado')
@UseInterceptors(ClassSerializerInterceptor)
export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  @Get()
  @UseGuards(AuthGuard())
  getAllByUser(
    @Query(ValidationPipe) getChamadosByUserDto: GetChamadosDto,
    @GetUser() user: User,
  ): Promise<Pagination<Chamado>> {
    return this.chamadoService.getChamadoByUser(user, getChamadosByUserDto);
  }

  @Get('solicitante')
  @UseGuards(SolicitanteGuard)
  getAll(
    @GetSolicitante() solicitante: Solicitante,
    @Query(ValidationPipe) getChamadosDto: GetChamadosDto,
  ): Promise<Pagination<Chamado>> {
    return this.chamadoService.getChamadosBySolicitante(
      solicitante,
      getChamadosDto,
    );
  }

  @Post()
  create(
    @Body(ValidationPipe) createChamadoDto: CreateChamadoDto,
  ): Promise<Chamado> {
    return this.chamadoService.createChamado(createChamadoDto);
  }

  @Get('solicitante/:id')
  @ApiHeader(solicitanteAuthHeaderSwagger)
  @UseGuards(SolicitanteGuard)
  getById(
    @Param('id', ParseIntPipe) id: number,
    @GetSolicitante() solicitante: Solicitante,
  ): Promise<Chamado> {
    return this.chamadoService.getChamadoById(id, solicitante);
  }

  @Put(':id/situacao')
  @UseGuards(AuthGuard())
  updateSituacao(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body(ValidationPipe) createAlteracaoDto: CreateAlteracaoDto,
  ) {
    const { situacao } = createAlteracaoDto;
    return situacao !== AlteracaoStatus.TRANSFERIDO
      ? this.chamadoService.updateChamadoSituacao(id, createAlteracaoDto, user)
      : this.chamadoService.transferChamado(id, createAlteracaoDto, user);
  }

  @Delete(':id')
  @ApiHeader(solicitanteAuthHeaderSwagger)
  @UseGuards(SolicitanteGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @GetSolicitante() solicitante: Solicitante,
  ): Promise<Chamado> {
    return this.chamadoService.cancelChamadoSituacao(id, solicitante);
  }
}

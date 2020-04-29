import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
  Put,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { SetorService } from './setor.service';
import { Setor } from './setor.entity';
import { GetManager, GetAdmin } from '../auth/get-user.decorator';
import { Manager } from '../auth/manager.model';
import { CreateSetorDto } from './dto/create-setor.dto';
import { Admin } from '../auth/admin.model';
import { UpdateSetorDto } from './dto/update-setor.dto';

const mainRoute = 'setor';
@Controller(mainRoute)
@ApiTags(mainRoute)
export class SetorController {
  constructor(private setorService: SetorService) {}

  @Get()
  @ApiOperation({ description: 'Consulta todos os Setores' })
  @ApiOkResponse({ description: 'Setores', type: [Setor] })
  getSetors(): Promise<Setor[]> {
    return this.setorService.getSetors();
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Consulta um Setor' })
  @ApiOkResponse({ type: Setor })
  @ApiNotFoundResponse()
  getSetorById(
    @Param('id', ParseIntPipe) id: number,
    @GetManager() manager: Manager,
  ): Promise<Setor> {
    return this.setorService.getSetorById(id, manager);
  }

  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(201)
  @ApiOperation({ description: 'Cria Setor' })
  @ApiOkResponse({ description: 'Setor criado', type: Setor })
  createSetor(
    @Body(ValidationPipe) createSetorDto: CreateSetorDto,
    @GetAdmin() admin: Admin,
  ): Promise<Setor> {
    return this.setorService.createSetor(createSetorDto, admin);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Atualiza Setor' })
  @ApiOkResponse({ type: Setor })
  @ApiNotFoundResponse()
  updateSetor(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSetorDto: UpdateSetorDto,
    @GetAdmin() admin: Admin,
  ): Promise<Setor> {
    return this.setorService.updateSetor(id, updateSetorDto, admin);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiOperation({ description: 'Remove Setor' })
  @ApiOkResponse({ type: Setor })
  @ApiNotFoundResponse()
  deleteSetor(
    @Param('id', ParseIntPipe) id: number,
    @GetAdmin() admin: Admin,
  ): Promise<void> {
    return this.setorService.deleteSetor(id, admin);
  }
}

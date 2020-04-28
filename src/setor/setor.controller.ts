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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
  getSetors(): Promise<Setor[]> {
    return this.setorService.getSetors();
  }

  @Get('/:id')
  @ApiOperation({ description: 'Consulta um Setor' })
  @UseGuards(AuthGuard())
  getSetorById(
    @Param('id', ParseIntPipe) id: number,
    @GetManager() manager: Manager,
  ): Promise<Setor> {
    return this.setorService.getSetorById(id, manager);
  }

  @Post()
  @ApiOperation({ description: 'Cria Setor' })
  @UseGuards(AuthGuard())
  createSetor(
    @Body(ValidationPipe) createSetorDto: CreateSetorDto,
    @GetAdmin() admin: Admin,
  ): Promise<Setor> {
    return this.setorService.createSetor(createSetorDto, admin);
  }

  @Put('/:id')
  @ApiOperation({ description: 'Atualiza Setor' })
  @UseGuards(AuthGuard())
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
  deleteSetor(
    @Param('id', ParseIntPipe) id: number,
    @GetAdmin() admin: Admin,
  ): Promise<void> {
    return this.setorService.deleteSetor(id, admin);
  }
}

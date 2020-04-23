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
} from '@nestjs/common';
import { SetorService } from './setor.service';
import { Setor } from './setor.entity';
import { GetManager, GetAdmin } from '../auth/get-user.decorator';
import { Manager } from '../auth/manager.model';
import { CreateSetorDto } from './dto/create-setor.dto';
import { Admin } from '../auth/admin.model';
import { UpdateSetorDto } from './dto/update-setor.dto';

@Controller('setor')
export class SetorController {
  constructor(private setorService: SetorService) {}

  @Get()
  getSetors(): Promise<Setor[]> {
    return this.setorService.getSetors();
  }

  @Get('/:id')
  getSetorById(
    @Param('id', ParseIntPipe) id: number,
    @GetManager() manager: Manager,
  ): Promise<Setor> {
    return this.setorService.getSetorById(id, manager);
  }

  @Post()
  createSetor(
    @Body(ValidationPipe) createSetorDto: CreateSetorDto,
    @GetAdmin() admin: Admin,
  ): Promise<Setor> {
    return this.setorService.createSetor(createSetorDto, admin);
  }

  @Put('/:id')
  updateSetor(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSetorDto: UpdateSetorDto,
    @GetAdmin() admin: Admin,
  ): Promise<Setor> {
    return this.setorService.updateSetor(id, updateSetorDto, admin);
  }

  @Delete('/:id')
  deleteSetor(
    @Param('id', ParseIntPipe) id: number,
    @GetAdmin() admin: Admin,
  ): Promise<void> {
    return this.setorService.deleteSetor(id, admin);
  }
}

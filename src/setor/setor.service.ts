import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SetorRepository } from './setor.repository';
import { Setor } from './setor.entity';
import { Manager } from 'src/auth/manager.model';
import { Admin } from 'src/auth/admin.model';
import { CreateSetorDto } from './dto/create-setor.dto';
import { UpdateSetorDto } from './dto/update-setor.dto';

@Injectable()
export class SetorService {
  private logger = new Logger('SetorService');
  constructor(
    @InjectRepository(SetorRepository) private setorRepository: SetorRepository,
  ) {}

  getSetors(): Promise<Setor[]> {
    return this.setorRepository.find({});
  }

  async getSetorById(id: number, manager: Manager): Promise<Setor> {
    let setor: Setor;
    if (manager.isAdmin() || manager.setor.id === id) {
      setor = await this.setorRepository.findOne(id);
    }
    if (!setor) {
      this.logger.log(
        `O usuário ${JSON.stringify(manager)} tentou acessar o setor #${id}`,
      );
      throw new NotFoundException(`Setor #${id} não encontrado.`);
    }
    return setor;
  }

  createSetor(createSetorDto: CreateSetorDto, admin: Admin): Promise<Setor> {
    this.logger.log(`Novo setor criado pelo admin ${JSON.stringify(admin)}`);
    return this.setorRepository.createSetor(createSetorDto);
  }

  async updateSetor(
    id: number,
    updateSetorDto: UpdateSetorDto,
    admin: Admin,
  ): Promise<Setor> {
    const setor = await this.getSetorById(id, admin);
    this.logger.log(
      `Setor ${JSON.stringify(setor)} editado pelo admin ${JSON.stringify(
        admin,
      )}`,
    );
    return this.setorRepository.updateSetor(setor, updateSetorDto);
  }

  async deleteSetor(id: number, admin: Admin): Promise<void> {
    const result = await this.setorRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Setor ${id} não encontrado.`);
    }
    this.logger.log(
      `Setor #${id} removido pelo admin ${JSON.stringify(admin)}`,
    );
  }
}

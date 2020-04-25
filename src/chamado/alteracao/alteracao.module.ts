import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlteracaoService } from './alteracao.service';
import { AlteracaoRepository } from './alteracao.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AlteracaoRepository])],
  providers: [AlteracaoService],
  exports: [AlteracaoService],
})
export class AlteracaoModule {}

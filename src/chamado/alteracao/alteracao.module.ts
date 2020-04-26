import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlteracaoService } from './alteracao.service';
import { AlteracaoRepository } from './alteracao.repository';
import { EmailModule } from '../../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([AlteracaoRepository]), EmailModule],
  providers: [AlteracaoService],
  exports: [AlteracaoService],
})
export class AlteracaoModule {}

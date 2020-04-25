import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetorController } from './setor.controller';
import { SetorService } from './setor.service';
import { SetorRepository } from './setor.repository';
import { AuthModule } from '../auth/auth.module';
import { ProblemaModule } from './problema/problema.module';

@Module({
  imports: [
    ProblemaModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([SetorRepository]),
  ],
  controllers: [SetorController],
  providers: [SetorService],
  exports: [SetorService],
})
export class SetorModule {}

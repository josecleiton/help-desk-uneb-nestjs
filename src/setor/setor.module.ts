import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetorController } from './setor.controller';
import { SetorService } from './setor.service';
import { SetorRepository } from './setor.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SetorRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SetorController],
  providers: [SetorService],
  exports: [SetorService],
})
export class SetorModule {}

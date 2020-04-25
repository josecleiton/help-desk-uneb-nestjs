import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemaService } from './problema.service';
import { ProblemaController } from './problema.controller';
import { ProblemaRepository } from './problema.repository';
import { AuthModule } from '../../auth/auth.module';
import { SetorModule } from '../setor.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => SetorModule),
    TypeOrmModule.forFeature([ProblemaRepository]),
  ],
  providers: [ProblemaService],
  controllers: [ProblemaController],
  exports: [ProblemaService],
})
export class ProblemaModule {}

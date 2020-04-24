import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemaService } from './problema.service';
import { ProblemaController } from './problema.controller';
import { ProblemaRepository } from './problema.repository';
import { AuthModule } from 'src/auth/auth.module';
import { SetorModule } from 'src/setor/setor.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => SetorModule),
    TypeOrmModule.forFeature([ProblemaRepository]),
  ],
  providers: [ProblemaService],
  controllers: [ProblemaController],
})
export class ProblemaModule {}

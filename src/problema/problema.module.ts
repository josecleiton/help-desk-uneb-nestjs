import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemaService } from './problema.service';
import { ProblemaController } from './problema.controller';
import { ProblemaRepository } from './problema.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProblemaRepository])],
  providers: [ProblemaService],
  controllers: [ProblemaController],
})
export class ProblemaModule {}

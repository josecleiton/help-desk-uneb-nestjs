import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SetorModule } from './setor/setor.module';
import { dbConfig } from './config/database.config';
import { ChamadoModule } from './chamado/chamado.module';
import { UploadModule } from './upload/upload.module';
import { cacheConfig } from './config/cache.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    CacheModule.register(cacheConfig),
    AuthModule,
    SetorModule,
    ChamadoModule,
    UploadModule,
  ],
})
export class AppModule {}

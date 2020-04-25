import { Module } from '@nestjs/common';
import { QueryRunnerFactory } from './query-runner.factory';

@Module({ providers: [QueryRunnerFactory], exports: [QueryRunnerFactory] })
export class DatabaseUtilModule {}

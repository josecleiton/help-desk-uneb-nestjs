import { BullModuleOptions } from '@nestjs/bull';
import { redisConfig } from '../config/redis.config';

export const chamadoQueueConfig: BullModuleOptions = {
  name: 'chamado-queue',
  redis: redisConfig,
};

export const chamadoQueueEvents = {
  broadcastChamados: 'broadcast-chamados',
};

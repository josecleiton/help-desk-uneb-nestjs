import { BullModuleOptions } from '@nestjs/bull';
import { redisConfig } from '../config/redis.config';

export const emailQueueConfig: BullModuleOptions = {
  name: 'email',
  redis: redisConfig,
};

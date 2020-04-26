import { RedisOptions } from 'ioredis';
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
export const redisConfig: RedisOptions = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  password: REDIS_PASSWORD,
};

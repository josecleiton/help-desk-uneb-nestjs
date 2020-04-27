import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const {
  NODE_ENV,
  DB_DATABASE,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
} = process.env;

export const dbConfig: TypeOrmModuleOptions = {
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  type: 'postgres',
  port: parseInt(DB_PORT),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: NODE_ENV === 'development',
};

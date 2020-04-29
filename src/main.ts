import 'dotenv/config';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { docsPath, appName, appDescription, appVersion } from './app.constants';
import { corsConfig } from './config/cors.config';
import { rateLimitConfig } from './config/rate-limit.config';

const { NODE_ENV } = process.env;
const logger = new Logger('bootstrap');

function buildSwaggerDoc(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsPath, app, document);
  logger.log(`Documentação gerada em /${docsPath} usando Swagger (OpenAPI)`);
}

function applySecurityLayer(app: NestExpressApplication) {
  app.use(helmet());
  app.use(rateLimit(rateLimitConfig));
  app.enableCors(corsConfig);
  app.set('trust proxy', NODE_ENV === 'production');
  logger.log('Camada de Segurança aplicada ao app');
}

async function bootstrap() {
  const { PORT } = process.env;
  const defaultPort = 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  buildSwaggerDoc(app);
  applySecurityLayer(app);
  if (!PORT) {
    logger.warn(`App usando porta padrão :${defaultPort}`);
  }
  await app.listen(PORT || defaultPort);
  logger.log(`App escutando a porta :${PORT}`);
  logger.log(`App rodando em: ${await app.getUrl()}`);
}

bootstrap();

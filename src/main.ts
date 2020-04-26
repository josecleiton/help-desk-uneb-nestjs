import 'dotenv/config';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { docsPath } from './app.constants';
import { corsConfig } from './config/cors.config';
import { rateLimitConfig } from './config/rate-limit.config';

const logger = new Logger('bootstrap');

function buildSwaggerDoc(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Help Desk Uneb')
    .setDescription('Help Desk Uneb API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsPath, app, document);
}

function applySecurityLayer(app: INestApplication) {
  app.use(helmet());
  app.use(csurf());
  app.use(rateLimit(rateLimitConfig));
  app.enableCors(corsConfig);
  logger.log('Application security layer applied');
}

async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create(AppModule);
  buildSwaggerDoc(app);
  applySecurityLayer(app);
  await app.listen(PORT || 3000);
  logger.log(`Application listening on port ${PORT}`);
}

bootstrap();

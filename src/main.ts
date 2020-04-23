import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { docsPath } from './app.constants';

function buildSwaggerDoc(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Help Desk Uneb')
    .setDescription('Help Desk Uneb API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsPath, app, document);
}

async function bootstrap() {
  const { PORT } = process.env;
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  buildSwaggerDoc(app);
  await app.listen(PORT || 3000);
  logger.log(`Application listening on port ${PORT}`);
}

bootstrap();

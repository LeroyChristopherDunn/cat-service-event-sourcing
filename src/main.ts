import * as dotenv from 'dotenv';
dotenv.config();
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'yaml';
import * as fs from 'fs';
import { ENVIRONMENT } from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function run() {
  const app = await createApp();

  const config = new DocumentBuilder()
    .setTitle('Cat Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  if (ENVIRONMENT !== 'production') {
    // docs json at /api-json
    SwaggerModule.setup('api', app, document);
    writeApiDocs(document);
  }

  await app.listen(5001);
}

export const createApp = async (expressInstance?: any) => {
  const app = await NestFactory.create(
    AppModule,
    expressInstance ? new ExpressAdapter(expressInstance) : undefined,
    { logger: ['warn'] },
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());

  return app;
};

function writeApiDocs(document) {
  fs.mkdir('./docs', { recursive: true }, (err) => {
    if (err) throw err;
  });

  const docsName = 'cat-service';

  fs.writeFileSync(`./docs/${docsName}.openapi.json`, JSON.stringify(document));

  const yamlString = yaml.stringify(document, {});
  fs.writeFileSync(`./docs/${docsName}.openapi.yaml`, yamlString);
}

run();

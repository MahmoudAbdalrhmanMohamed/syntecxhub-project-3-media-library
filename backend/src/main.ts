import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('SyntecxhubBootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 4000;
  const corsOrigin = configService.get<string>('corsOrigin') || 'http://localhost:3000';

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Syntecxhub Enterprise Management Platform API')
    .setDescription(
      'Production REST API for User Administration, Hardware & SaaS Inventory Management, Media Library Uploads, and Executive Analytics.',
    )
    .setVersion('1.0.0')
    .addTag('Dashboard', 'Real-time KPI metrics and platform activity stream')
    .addTag('Users', 'User directory, role-based status management, and search')
    .addTag('Products', 'Product catalog, SKU inventory tracking, and pricing filters')
    .addTag('Uploads', 'Multipart image upload pipeline and media metadata store')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Syntecxhub API Reference',
  });

  await app.listen(port);
  logger.log(`Syntecxhub API Server running on http://localhost:${port}/api`);
  logger.log(`Swagger OpenAPI Documentation at http://localhost:${port}/api/docs`);
}

bootstrap();

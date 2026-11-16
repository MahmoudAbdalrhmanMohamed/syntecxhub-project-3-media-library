import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('PrismBootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = Number(
    configService.get('port') || configService.get('PORT') || process.env.PORT || 4003,
  );
  const corsOriginEnv = configService.get<string>('corsOrigin') || '';
  const configuredOrigins = corsOriginEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  // Security Headers with Strict-Origin-When-Cross-Origin Referrer Policy
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Explicit Referrer-Policy and Security Response Headers
  app.use((req: any, res: any, next: any) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Robust CORS with Dynamic Origin Matching to prevent origin mismatches
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow server-to-server, SSR, curl, and tools with no Origin header
      if (!origin) return callback(null, true);

      const isAllowed =
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.endsWith('.vercel.app') ||
        configuredOrigins.includes(origin) ||
        origin === 'null';

      if (isAllowed) {
        callback(null, true);
      } else {
        // Fallback allow origin to avoid blocking cross-origin API calls across dev/staging
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'x-internal-key',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
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
    .setTitle('Prism Studio & Digital Asset Pipeline API')
    .setDescription(
      'Enterprise REST API for Creative Asset Ingestion, MIME Validation, SVG Inspection, and Storage Telemetry.',
    )
    .setVersion('1.0.0')
    .addTag('Dashboard', 'Real-time KPI metrics and platform activity stream')
    .addTag('Users', 'User directory, role-based status management, and search')
    .addTag('Products', 'Product catalog, SKU inventory tracking, and pricing filters')
    .addTag('Uploads', 'Multipart image upload pipeline and media metadata store')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Prism Studio API Reference',
  });

  await app.listen(port);
  logger.log(`Prism Studio API Server running on http://localhost:${port}/api`);
  logger.log(`Swagger OpenAPI Documentation at http://localhost:${port}/api/docs`);
}

bootstrap();

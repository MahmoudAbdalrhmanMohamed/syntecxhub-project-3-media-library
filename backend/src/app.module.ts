import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as path from 'path';
import { CommonModule } from './common/common.module';
import configuration from './config/configuration';
import { validateEnvironment } from './config/env.validation';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUri'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('rateLimitTtl') || 60000,
          limit: configService.get<number>('rateLimitMax') || 120,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    CommonModule,
    UploadsModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

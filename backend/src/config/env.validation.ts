import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsOptional()
  @IsInt()
  @Min(1024)
  @Max(65535)
  PORT: number = 4000;

  @IsOptional()
  @IsString()
  MONGODB_URI: string = 'mongodb://localhost:27017/syntecxhub_platform';

  @IsOptional()
  @IsString()
  CORS_ORIGIN: string = 'http://localhost:3000';

  @IsOptional()
  @IsString()
  PUBLIC_BASE_URL: string = 'http://localhost:4000';

  @IsOptional()
  @IsInt()
  @Min(102400)
  MAX_FILE_SIZE_BYTES: number = 5242880;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }
  return validatedConfig;
}

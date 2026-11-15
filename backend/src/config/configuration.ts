export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  corsOrigin: string;
  publicBaseUrl: string;
  maxFileSizeBytes: number;
  rateLimitTtl: number;
  rateLimitMax: number;
}

export default (): AppConfiguration => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/syntecxhub_platform',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:4000',
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES || '5242880', 10),
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '120', 10),
});

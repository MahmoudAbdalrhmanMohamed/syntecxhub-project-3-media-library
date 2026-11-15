import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An unexpected server error occurred';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorName = exception.name;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, unknown>;
        message = (resObj.message as string | string[]) || exception.message;
        errorName = (resObj.error as string) || exception.name;
      }
    } else if (
      exception &&
      typeof exception === 'object' &&
      'code' in exception &&
      (exception as { code: number }).code === 11000
    ) {
      status = HttpStatus.CONFLICT;
      errorName = 'ConflictError';
      const keyValue = (exception as { keyValue?: Record<string, unknown> }).keyValue;
      const duplicateField = keyValue ? Object.keys(keyValue)[0] : 'field';
      message = `A record with that ${duplicateField} already exists.`;
    } else if (
      exception &&
      typeof exception === 'object' &&
      'name' in exception &&
      (exception as { name: string }).name === 'ValidationError'
    ) {
      status = HttpStatus.BAD_REQUEST;
      errorName = 'DatabaseValidationError';
      message = (exception as { message?: string }).message || 'Database validation failed';
    } else if (
      exception &&
      typeof exception === 'object' &&
      'name' in exception &&
      (exception as { name: string }).name === 'MulterError'
    ) {
      const multerErr = exception as { code?: string; message?: string };
      status =
        multerErr.code === 'LIMIT_FILE_SIZE'
          ? HttpStatus.PAYLOAD_TOO_LARGE
          : HttpStatus.BAD_REQUEST;
      errorName = 'FileUploadError';
      message =
        multerErr.code === 'LIMIT_FILE_SIZE'
          ? 'File exceeds maximum permitted upload size (5 MB).'
          : multerErr.message || 'Invalid file upload request.';
    } else if (exception instanceof Error) {
      message = exception.message;
      errorName = exception.name;
    }

    this.logger.error(
      `[${request.method}] ${request.url} -> ${status}: ${
        Array.isArray(message) ? message.join(', ') : message
      }`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      error: errorName,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

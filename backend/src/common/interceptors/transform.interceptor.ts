import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardApiResponse<unknown>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardApiResponse<unknown>> {
    const response = context.switchToHttp().getResponse();
    const statusCode: number = response.statusCode || 200;

    return next.handle().pipe(
      map((payload: unknown) => {
        if (
          payload &&
          typeof payload === 'object' &&
          'items' in payload &&
          'meta' in payload
        ) {
          const paginated = payload as {
            items: unknown;
            meta: StandardApiResponse<unknown>['meta'];
            message?: string;
          };
          return {
            success: true,
            statusCode,
            message: paginated.message || 'Records retrieved successfully',
            data: paginated.items,
            meta: paginated.meta,
            timestamp: new Date().toISOString(),
          };
        }

        const customMessage =
          payload &&
          typeof payload === 'object' &&
          'message' in payload &&
          'data' in payload
            ? String((payload as Record<string, unknown>).message)
            : 'Operation completed successfully';

        const unwrappedData =
          payload &&
          typeof payload === 'object' &&
          'message' in payload &&
          'data' in payload &&
          Object.keys(payload as object).length === 2
            ? (payload as Record<string, unknown>).data
            : payload;

        return {
          success: true,
          statusCode,
          message: customMessage,
          data: unwrappedData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

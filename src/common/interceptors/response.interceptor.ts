import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageMetaDto } from '../pagination/dto/pagination-meta.dto';
import { WinstonLogger } from '../logger/logger.service';

export class ResponseFormat<T> {
  @ApiProperty()
  isArray: boolean;
  @ApiProperty()
  path: string;
  @ApiProperty()
  duration: string;
  @ApiProperty()
  method: string;
  @ApiProperty()
  data: T;
  @ApiProperty()
  statusCode: number;
  @ApiPropertyOptional()
  meta?: PageMetaDto;
  @ApiProperty()
  timestamp: string;
  @ApiProperty()
  message: Array<string>;
  @ApiProperty()
  success: boolean;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  constructor(private readonly logger: WinstonLogger) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const status = response?.statusCode;

    const logMessage = `${request.method} ${request.url} ${status} ${
      Date.now() - now
    }ms`;
    this.logger.log(logMessage);

    return next.handle().pipe(
      map((data) => ({
        data: data?.response || data,
        meta: data?.meta,
        isArray: Array.isArray(data?.response || data),
        path: request.path,
        duration: `${Date.now() - now}ms`,
        method: request.method,
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: ['Success'],
        success: true,
      })),
    );
  }
}

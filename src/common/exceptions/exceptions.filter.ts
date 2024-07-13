import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseFormat } from '../interceptors/response.interceptor';
import { WinstonLogger } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const now = Date.now();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const errorResponse: ResponseFormat<any> = {
        data: null,
        meta: null,
        isArray: false,
        path: request.url,
        duration: `${Date.now() - now}ms`,
        method: request.method,
        timestamp: new Date().toISOString(),
        statusCode: status,
        message: exception.response.message,
        success: false,
      };
      errorResponse.message.push(exception.message);

    response.status(status).json(errorResponse);

    this.logger.error(
      `${request.method} ${request.url} ${status} ${exception.message}`,
      exception.stack,
    );
  }
}

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { CLIENT_ERROR_CODE, DomainError } from 'src/@core/errors/index.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  private readonly errorCodeToHttpStatusMap: Record<
    CLIENT_ERROR_CODE,
    HttpStatus
  > = {
    [CLIENT_ERROR_CODE.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [CLIENT_ERROR_CODE.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
    [CLIENT_ERROR_CODE.TASK_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [CLIENT_ERROR_CODE.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [CLIENT_ERROR_CODE.IN_PROGRESS_OR_COMPLETED]: HttpStatus.BAD_REQUEST,
    [CLIENT_ERROR_CODE.NOT_COMPLETED]: HttpStatus.BAD_REQUEST,
    [CLIENT_ERROR_CODE.ALREADY_COMPLETED]: HttpStatus.BAD_REQUEST,
    [CLIENT_ERROR_CODE.IS_NOT_OWNER]: HttpStatus.FORBIDDEN,
    [CLIENT_ERROR_CODE.EMAIL_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  };

  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      this.errorCodeToHttpStatusMap[exception.clientErrorCode] ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorCode: exception.clientErrorCode,
      message: HttpStatus[status].toLowerCase().replace(/_/g, ' '),
    };

    this.logger.error(
      `Domain Error: ${exception.message}`,
      exception.stack,
      `${request.method} ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}

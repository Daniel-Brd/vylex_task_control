export enum CLIENT_ERROR_CODE {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
}

export class DomainError extends Error {
  public readonly clientErrorCode: CLIENT_ERROR_CODE;

  constructor(message: string, clientErrorCode: CLIENT_ERROR_CODE) {
    super(message);

    this.name = 'DomainError';
    this.clientErrorCode = clientErrorCode;
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(
    message: string = 'Invalid credentials provided.',
    clientErrorCode: CLIENT_ERROR_CODE = CLIENT_ERROR_CODE.INVALID_CREDENTIALS,
  ) {
    super(message, clientErrorCode);
    this.name = 'InvalidCredentialsError';
  }
}

export class NotFoundError extends DomainError {
  constructor(
    message: string = 'Record not found.',
    clientErrorCode: CLIENT_ERROR_CODE = CLIENT_ERROR_CODE.RECORD_NOT_FOUND,
  ) {
    super(message, clientErrorCode);
    this.name = 'NotFoundError';
  }
}

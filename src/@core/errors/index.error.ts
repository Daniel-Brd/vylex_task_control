export enum CLIENT_ERROR_CODE {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  IN_PROGRESS_OR_COMPLETED = 'IN_PROGRESS_OR_COMPLETED',
  NOT_COMPLETED = 'NOT_COMPLETED',
  ALREADY_COMPLETED = 'ALREADY_COMPLETED',
  IS_NOT_OWNER = 'IS_NOT_OWNER',
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
    clientErrorCode: CLIENT_ERROR_CODE = CLIENT_ERROR_CODE.INTERNAL_ERROR,
  ) {
    super(message, clientErrorCode);
    this.name = 'NotFoundError';
  }
}

export class DomainRuleError extends DomainError {
  constructor(
    message: string,
    clientErrorCode: CLIENT_ERROR_CODE = CLIENT_ERROR_CODE.INTERNAL_ERROR,
  ) {
    super(message, clientErrorCode);
    this.name = 'DomainRuleError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(
    message: string = 'Unauthorized access.',
    clientErrorCode: CLIENT_ERROR_CODE = CLIENT_ERROR_CODE.INTERNAL_ERROR,
  ) {
    super(message, clientErrorCode);
    this.name = 'UnauthorizedError';
  }
}

export enum CLIENT_ERROR_CODE {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
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

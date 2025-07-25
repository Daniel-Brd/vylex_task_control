import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export const CLIENT_ERROR_CODE = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  IN_PROGRESS_OR_COMPLETED: 'IN_PROGRESS_OR_COMPLETED',
  NOT_COMPLETED: 'NOT_COMPLETED',
  ALREADY_COMPLETED: 'ALREADY_COMPLETED',
  IS_NOT_OWNER: 'IS_NOT_OWNER',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
} as const;

const COMMOM_MESSAGES: Record<string, string> = {
  [CLIENT_ERROR_CODE.INTERNAL_ERROR]: 'Ocorreu um erro inesperado.',
  UNEXPECTED: 'Ocorreu um erro inesperado.',
};

export type CLIENT_ERROR_CODE = (typeof CLIENT_ERROR_CODE)[keyof typeof CLIENT_ERROR_CODE];

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errorCode: CLIENT_ERROR_CODE;
}

export const handleApiError = (error: unknown, errorMessages: Record<CLIENT_ERROR_CODE, string>) => {
  if (!isAxiosError<ErrorResponse>(error) || !error.response?.data?.errorCode) {
    toast.error(COMMOM_MESSAGES.UNEXPECTED);
    return;
  }
  const clientErrorCode = error.response.data.errorCode;
  const errorMessage = errorMessages[clientErrorCode] || COMMOM_MESSAGES.UNEXPECTED;

  toast.error(errorMessage);
};

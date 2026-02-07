export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_KEY_INVALID = 'API_KEY_INVALID',
  RATE_LIMITED = 'RATE_LIMITED',
  RESPONSE_PARSE_ERROR = 'RESPONSE_PARSE_ERROR',
  EMPTY_RESPONSE = 'EMPTY_RESPONSE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CLIPBOARD_ERROR = 'CLIPBOARD_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  detail?: string;
  retryable: boolean;
}

const ERROR_MESSAGES: Record<ErrorCode, { message: string; retryable: boolean }> = {
  [ErrorCode.NETWORK_ERROR]: {
    message: 'Network error. Check your connection and try again.',
    retryable: true,
  },
  [ErrorCode.API_KEY_INVALID]: {
    message: 'Invalid API key. Check your configuration.',
    retryable: false,
  },
  [ErrorCode.RATE_LIMITED]: {
    message: 'Rate limited. Wait a moment and try again.',
    retryable: true,
  },
  [ErrorCode.RESPONSE_PARSE_ERROR]: {
    message: 'Failed to parse the response. Try again.',
    retryable: true,
  },
  [ErrorCode.EMPTY_RESPONSE]: {
    message: 'Received an empty response. Try again.',
    retryable: true,
  },
  [ErrorCode.VALIDATION_ERROR]: {
    message: 'Invalid input.',
    retryable: false,
  },
  [ErrorCode.CLIPBOARD_ERROR]: {
    message: 'Failed to copy to clipboard.',
    retryable: false,
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    message: 'Something went wrong. Try again.',
    retryable: true,
  },
};

export function createAppError(code: ErrorCode, detail?: string): AppError {
  const { message, retryable } = ERROR_MESSAGES[code];
  return { code, message, detail, retryable };
}

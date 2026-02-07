import React from 'react';
import { AppError } from '../services/errors';

interface ErrorMessageProps {
  error: AppError;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div role="alert" className="flex items-center gap-3">
      <span className="text-[9px] mono uppercase text-red-500 tracking-widest italic">
        {error.detail || error.message}
      </span>
      {error.retryable && onRetry && (
        <button
          onClick={onRetry}
          className="text-[9px] mono uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

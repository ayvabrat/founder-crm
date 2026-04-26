export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class APIError extends AppError {
  constructor(message: string, provider: string, details?: unknown) {
    super(message, `${provider.toUpperCase()}_API_ERROR`, 502, details);
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(error.message, "UNKNOWN_ERROR", 500);
  return new AppError("Unknown error", "UNKNOWN_ERROR", 500);
}


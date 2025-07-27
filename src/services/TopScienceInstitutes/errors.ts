/**
 * 🚨 Top Science Institutes - Error Handling
 * Comprehensive error classes and utilities for the TopScienceInstitutes service
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Base error class for TopScienceInstitutes service
 */
export class TopScienceInstitutesError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string = 'TOP_SCIENCE_INSTITUTES_ERROR',
    statusCode: number = 500,
    context: Record<string, unknown> = {},
    isOperational: boolean = true
  ) {
    super(message);
    
    // Set the prototype explicitly for proper inheritance
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Convert error to JSON representation
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { stack: this.stack })
    };
  }

  /**
   * Create a new error from another error
   */
  public static fromError(
    error: unknown,
    code: string = 'UNEXPECTED_ERROR',
    statusCode: number = 500,
    context: Record<string, unknown> = {}
  ): TopScienceInstitutesError {
    if (error instanceof TopScienceInstitutesError) {
      return error;
    }

    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorContext = error instanceof Error ? { originalError: error.message, ...context } : context;
    
    return new TopScienceInstitutesError(
      message,
      code,
      statusCode,
      errorContext,
      false
    );
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends TopScienceInstitutesError {
  constructor(message: string = 'Bad Request', context: Record<string, unknown> = {}) {
    super(message, 'BAD_REQUEST', 400, context);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends TopScienceInstitutesError {
  constructor(message: string = 'Unauthorized', context: Record<string, unknown> = {}) {
    super(message, 'UNAUTHORIZED', 401, context);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends TopScienceInstitutesError {
  constructor(message: string = 'Forbidden', context: Record<string, unknown> = {}) {
    super(message, 'FORBIDDEN', 403, context);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends TopScienceInstitutesError {
  constructor(resource: string = 'Resource', context: Record<string, unknown> = {}) {
    super(`${resource} not found`, 'NOT_FOUND', 404, context);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends TopScienceInstitutesError {
  constructor(message: string = 'Conflict', context: Record<string, unknown> = {}) {
    super(message, 'CONFLICT', 409, context);
  }
}

/**
 * 422 Unprocessable Entity Error
 */
export class ValidationError extends TopScienceInstitutesError {
  public readonly errors: Record<string, string[]>;

  constructor(
    errors: Record<string, string[]>,
    message: string = 'Validation failed',
    context: Record<string, unknown> = {}
  ) {
    super(message, 'VALIDATION_ERROR', 422, context);
    this.errors = errors;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors
    };
  }
}

/**
 * 429 Too Many Requests Error
 */
export class RateLimitError extends TopScienceInstitutesError {
  constructor(message: string = 'Too many requests', context: Record<string, unknown> = {}) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, context);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends TopScienceInstitutesError {
  constructor(message: string = 'Internal Server Error', context: Record<string, unknown> = {}) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, context);
  }
}

/**
 * 503 Service Unavailable Error
 */
export class ServiceUnavailableError extends TopScienceInstitutesError {
  constructor(service: string, context: Record<string, unknown> = {}) {
    super(
      `${service} service is currently unavailable`,
      'SERVICE_UNAVAILABLE',
      503,
      { service, ...context }
    );
  }
}

/**
 * Error handler middleware for Express
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle TopScienceInstitutesError instances
  if (error instanceof TopScienceInstitutesError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.toJSON()
    });
    return;
  }

  // Handle JWT errors
  if ((error as any).name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        statusCode: 401
      }
    });
    return;
  }

  // Handle validation errors (e.g., from express-validator)
  if ((error as any).errors) {
    const validationError = new ValidationError(
      (error as any).errors,
      'Validation failed',
      { originalError: (error as any).message }
    );
    res.status(validationError.statusCode).json({
      success: false,
      error: validationError.toJSON()
    });
    return;
  }

  // Handle rate limiting errors
  if ((error as any).type === 'entity.parse.failed') {
    const badRequestError = new BadRequestError('Invalid JSON payload');
    res.status(badRequestError.statusCode).json({
      success: false,
      error: badRequestError.toJSON()
    });
    return;
  }

  // Handle rate limiting errors
  if ((error as any).status === 429) {
    const rateLimitError = new RateLimitError('Too many requests, please try again later', {
      retryAfter: (error as any).retryAfter
    });
    res.status(rateLimitError.statusCode).json({
      success: false,
      error: rateLimitError.toJSON()
    });
    return;
  }

  // Handle all other errors
  const internalError = TopScienceInstitutesError.fromError(error);
  
  // Log the full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled error:', error);
  }

  res.status(internalError.statusCode).json({
    success: false,
    error: internalError.toJSON()
  });
}

/**
 * Async error handler wrapper for Express routes
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

/**
 * Creates a custom error class for a specific error type
 */
export function createErrorClass(
  name: string,
  defaultMessage: string,
  defaultCode: string,
  defaultStatusCode: number = 500
) {
  return class extends TopScienceInstitutesError {
    constructor(
      message: string = defaultMessage,
      code: string = defaultCode,
      statusCode: number = defaultStatusCode,
      context: Record<string, unknown> = {}
    ) {
      super(message, code, statusCode, context);
      this.name = name;
    }
  };
}

// Example usage of createErrorClass
export const DatabaseError = createErrorClass(
  'DatabaseError',
  'A database error occurred',
  'DATABASE_ERROR',
  500
);

export const NetworkError = createErrorClass(
  'NetworkError',
  'A network error occurred',
  'NETWORK_ERROR',
  503
);

export const ConfigurationError = createErrorClass(
  'ConfigurationError',
  'Invalid configuration',
  'INVALID_CONFIGURATION',
  500
);

/**
 * Error codes for reference
 */
export const ERROR_CODES = {
  // 4xx Client Errors
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Custom Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONFIGURATION_ERROR: 'INVALID_CONFIGURATION',
  
  // GameDin Integration Errors
  GAMEDIN_INTEGRATION_ERROR: 'GAMEDIN_INTEGRATION_ERROR',
  GAMEDIN_AUTH_ERROR: 'GAMEDIN_AUTH_ERROR',
  GAMEDIN_API_ERROR: 'GAMEDIN_API_ERROR',
  
  // Validation Errors
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_LIMIT_EXCEEDED: 'RESOURCE_LIMIT_EXCEEDED',
  
  // Authentication & Authorization
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  EXTERNAL_SERVICE_UNAVAILABLE: 'EXTERNAL_SERVICE_UNAVAILABLE',
  
  // Rate Limiting
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Maintenance Mode
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
  
  // Deprecated
  DEPRECATED: 'DEPRECATED',
  
  // Timeout
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  
  // Not Implemented
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED'
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

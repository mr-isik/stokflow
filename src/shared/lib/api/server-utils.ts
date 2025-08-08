import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { normalizeError, type AppError, ERROR_MESSAGES } from '../errors';

// API route error handler
export function handleApiError(error: unknown): NextResponse {
    const normalizedError = normalizeError(error);

    // Log error on server
    console.error('API Error:', normalizedError);

    return NextResponse.json(
        {
            error: normalizedError.code,
            message: normalizedError.message,
            field: normalizedError.field,
            ...(process.env.NODE_ENV === 'development' && {
                details: normalizedError.details,
            }),
        },
        { status: normalizedError.status || 500 }
    );
}

// Validation error handler
export function handleValidationError(
    errors: Record<string, string>,
    message = ERROR_MESSAGES.validation_failed
): NextResponse {
    return NextResponse.json(
        {
            error: 'validation_failed',
            message,
            fieldErrors: errors,
        },
        { status: 422 }
    );
}

// Success response helper
export function successResponse<T>(data: T, status = 200): NextResponse {
    return NextResponse.json(data, { status });
}

// API route wrapper with error handling
export function withErrorHandling<T = any>(
    handler: () => Promise<T>
): Promise<NextResponse> {
    return handler()
        .then(data => successResponse(data))
        .catch(handleApiError);
}

// Validation helper
export function validateRequest<T>(
    schema: ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; response: NextResponse } {
    const result = schema.safeParse(data);

    if (!result.success) {
        const fieldErrors = result.error.issues.reduce(
            (acc, issue) => {
                const field = issue.path[0] as string;
                acc[field] = issue.message;
                return acc;
            },
            {} as Record<string, string>
        );

        return {
            success: false,
            response: handleValidationError(fieldErrors),
        };
    }

    return { success: true, data: result.data };
}

// Async API route wrapper
export function createApiHandler<TRequest = any, TResponse = any>(
    handler: (data: TRequest) => Promise<TResponse>,
    options?: {
        requestSchema?: ZodSchema<TRequest>;
        requireAuth?: boolean;
    }
) {
    return async (request: Request): Promise<NextResponse> => {
        try {
            let requestData: TRequest;

            // Parse request body if needed
            if (request.method !== 'GET') {
                const body = await request.json();

                // Validate request if schema provided
                if (options?.requestSchema) {
                    const validation = validateRequest(
                        options.requestSchema,
                        body
                    );
                    if (!validation.success) {
                        return validation.response;
                    }
                    requestData = validation.data;
                } else {
                    requestData = body;
                }
            } else {
                requestData = {} as TRequest;
            }

            // TODO: Add auth check if required
            if (options?.requireAuth) {
                // Implement auth check here
            }

            // Execute handler
            const result = await handler(requestData);
            return successResponse(result);
        } catch (error) {
            return handleApiError(error);
        }
    };
}

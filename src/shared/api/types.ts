import { z } from 'zod';

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Configuration
export interface ApiConfig {
    enableValidation: boolean;
    enableLogging: boolean;
    enableRetry: boolean;
    maxRetries: number;
    retryDelay: number;
    timeout: number;
}

// Request configuration with validation
export interface ApiRequestConfig<TRequest = any> {
    url: string;
    method: HttpMethod;
    data?: TRequest;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    validationSchema?: z.ZodSchema<TRequest>;
    responseSchema?: z.ZodSchema<any>;
    skipValidation?: boolean;
    skipLogging?: boolean;
    retries?: number;
}

// Generic API Response
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    meta?: {
        timestamp: string;
        requestId?: string;
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

// Error types
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
    details?: any;
    timestamp: Date;
    requestId?: string;
}

// Pagination types
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedData<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Request/Response logging
export interface RequestLog {
    id: string;
    method: HttpMethod;
    url: string;
    headers?: Record<string, string>;
    data?: any;
    timestamp: Date;
}

export interface ResponseLog {
    requestId: string;
    status: number;
    statusText: string;
    data?: any;
    duration: number;
    timestamp: Date;
    errors?: string[];
}

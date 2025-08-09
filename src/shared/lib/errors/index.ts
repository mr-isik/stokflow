import { z } from 'zod';

// Hata tipleri
export interface AppError {
    code: string;
    message: string;
    details?: unknown;
    field?: string;
    status?: number;
}

export const ERROR_MESSAGES = {
    invalid_credentials: 'E-posta veya şifre hatalı',
    user_already_registered: 'Bu e-posta adresi zaten kayıtlı',
    email_not_confirmed: 'E-posta adresinizi doğrulamanız gerekiyor',
    too_many_requests:
        'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin',
    weak_password: 'Şifre yeterince güçlü değil',
    invalid_email: 'Geçersiz e-posta adresi',
    user_not_found: 'Kullanıcı bulunamadı',
    signup_disabled: 'Kayıt işlemi şu anda kapalı',
    token_expired: 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın',

    validation_failed: 'Girilen bilgileri kontrol edin',
    network_error: 'İnternet bağlantısını kontrol edin',
    server_error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin',
    timeout: 'İşlem zaman aşımına uğradı',
    unknown_error: 'Beklenmeyen bir hata oluştu',
    unauthorized: 'Bu işlem için yetkiniz yok',
    forbidden: 'Bu işleme erişim izniniz yok',
    not_found: 'Aradığınız kaynak bulunamadı',
    conflict: 'Bu bilgiler zaten kullanımda',

    duplicate_key: 'Bu bilgi zaten mevcut',
    foreign_key_violation: 'İlişkili veri hatası',
    not_null_violation: 'Zorunlu alan eksik',
} as const;

// Hata kodlarını normalize eden fonksiyon
export const normalizeErrorCode = (error: unknown): string => {
    if (typeof error === 'string') return error;

    const errorObj = error as any;
    const code =
        errorObj?.code || errorObj?.error || errorObj?.type || 'unknown_error';

    // Supabase hata mesajlarından kod çıkar
    const message = (errorObj?.message || '').toLowerCase();

    if (
        message.includes('user already registered') ||
        message.includes('already exists')
    ) {
        return 'user_already_registered';
    } else if (
        message.includes('invalid login credentials') ||
        message.includes('invalid credentials')
    ) {
        return 'invalid_credentials';
    } else if (message.includes('email not confirmed')) {
        return 'email_not_confirmed';
    } else if (message.includes('too many requests')) {
        return 'too_many_requests';
    } else if (
        message.includes('weak password') ||
        message.includes('password should be')
    ) {
        return 'weak_password';
    } else if (message.includes('invalid email')) {
        return 'invalid_email';
    } else if (message.includes('user not found')) {
        return 'user_not_found';
    } else if (message.includes('signup is disabled')) {
        return 'signup_disabled';
    }

    return code;
};

// HTTP status koduna göre hata kodu
export const getErrorCodeByStatus = (status: number): string => {
    switch (status) {
        case 400:
            return 'validation_failed';
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not_found';
        case 409:
            return 'conflict';
        case 422:
            return 'validation_failed';
        case 429:
            return 'too_many_requests';
        case 500:
            return 'server_error';
        case 502:
            return 'server_error';
        case 503:
            return 'server_error';
        case 504:
            return 'timeout';
        default:
            return 'unknown_error';
    }
};

// Ana hata normalize fonksiyonu
export const normalizeError = (error: unknown): AppError => {
    const errorObj = error as any;

    // Network error check
    if (!errorObj?.response && errorObj?.request) {
        return {
            code: 'network_error',
            message: ERROR_MESSAGES.network_error,
            status: 0,
        };
    }

    // API response error
    if (errorObj?.response) {
        const { status, data } = errorObj.response;

        // Server'dan gelen hata mesajını al
        const serverError = data?.error || data?.message;
        const serverCode = data?.code;

        // Hata kodunu normalize et
        const code =
            serverCode ||
            normalizeErrorCode(serverError) ||
            getErrorCodeByStatus(status);

        // Field bilgisini al
        const field = data?.field;

        return {
            code,
            message:
                ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ||
                serverError ||
                ERROR_MESSAGES.unknown_error,
            details: data,
            field,
            status,
        };
    }

    // Client-side error
    const code = normalizeErrorCode(error);

    return {
        code,
        message:
            ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ||
            errorObj?.message ||
            ERROR_MESSAGES.unknown_error,
        details: errorObj,
    };
};

// Form hatalarını organize eden fonksiyon
export const organizeFormErrors = (
    error: AppError
): {
    serverError: string | null;
    fieldErrors: Record<string, string>;
} => {
    if (error.field) {
        return {
            serverError: null,
            fieldErrors: {
                [error.field]: error.message,
            },
        };
    }

    return {
        serverError: error.message,
        fieldErrors: {},
    };
};

// Error response schema for API routes
export const errorResponseSchema = z.object({
    error: z.string(),
    message: z.string().optional(),
    code: z.string().optional(),
    field: z.string().optional(),
    details: z.any().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

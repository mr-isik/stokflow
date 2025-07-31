// Test sabitler - Tüm test dosyalarında kullanılan label'lar ve mesajlar

export const TEST_LABELS = {
    // Form Labels
    EMAIL: /email/i,
    PASSWORD: /şifre/i,
    SIGNUP_PASSWORD: /^Şifre$/,
    PASSWORD_CONFIRM: /Şifreyi Onayla/i,
    NAME: /ad soyad/i,

    // Button Labels
    LOGIN_BUTTON: /giriş yap/i,
    SIGNUP_BUTTON: /kayıt ol/i,
    CREATE_ACCOUNT_BUTTON: /hesap oluştur/i,
    FORGOT_PASSWORD_LINK: /şifremi unuttum/i,
    TOGGLE_PASSWORD: /toggle password visibility/i,

    // Icon test ids
    EYE_ICON: 'eye-icon',
    EYE_OFF_ICON: 'eye-off-icon',
} as const;

export const ERROR_MESSAGES = {
    // Email Errors
    EMAIL_REQUIRED: /e-posta adresi gerekli/i,
    EMAIL_REQUIRED_ALT: /e-posta adresi gerekli/i,
    EMAIL_INVALID: /geçerli bir e-posta adresi girin/i,

    // Password Errors
    PASSWORD_REQUIRED: /şifre gerekli/i,
    PASSWORD_MIN_LENGTH: /şifre en az 6 karakter olmalı/i,
    PASSWORD_MIN_LENGTH_8: /şifre en az 8 karakter olmalı/i,
    PASSWORD_UPPERCASE: /şifre en az bir büyük harf içermeli/i,
    PASSWORD_LOWERCASE: /şifre en az bir küçük harf içermeli/i,
    PASSWORD_NUMBER: /şifre en az bir rakam içermeli/i,
    PASSWORD_SPECIAL: /şifre en az bir özel karakter içermeli/i,
    PASSWORD_CONFIRM_REQUIRED: /şifre tekrarı gerekli/i,
    PASSWORD_MISMATCH: /şifreler eşleşmiyor/i,

    // Name Errors
    NAME_REQUIRED: /ad ve soyad gerekli/i,
    NAME_REQUIRED_ALT: /i̇sim gerekli/i,

    // Server Errors
    INVALID_CREDENTIALS: /geçersiz kullanıcı bilgileri/i,
    EMAIL_ALREADY_EXISTS: /bu e-posta adresi zaten kullanılıyor/i,
    SERVER_ERROR: /server error/i,
} as const;

export const TEST_DATA = {
    // Valid Test Data
    VALID_EMAIL: 'test@test.com',
    VALID_PASSWORD: 'Password123!',
    VALID_NAME: 'Test User',
    TURKISH_NAME: 'Ömer Faruk',
    TURKISH_PASSWORD: 'Şifrem123!',

    // Invalid Test Data
    INVALID_EMAIL: 'geçersiz-email',
    SHORT_PASSWORD: '123',
    SHORT_PASSWORD_8: '123Aa!',
    WEAK_PASSWORD_NO_UPPER: 'password123!',
    WEAK_PASSWORD_NO_LOWER: 'PASSWORD123!',
    WEAK_PASSWORD_NO_NUMBER: 'Password!',
    WEAK_PASSWORD_NO_SPECIAL: 'Password123',
    DIFFERENT_PASSWORD: 'DifferentPassword123!',
    WRONG_PASSWORD: 'wrongpassword',

    // URLs and Paths
    DASHBOARD_URL: '/dashboard',

    // Mock Responses
    MOCK_USER: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
    },
    MOCK_TOKEN: 'fake-token',
} as const;

export const PASSWORD_REQUIREMENTS = {
    MIN_LENGTH: /en az 6 karakter/i,
    MIN_LENGTH_8: /en az 8 karakter/i,
    UPPERCASE: /en az bir büyük harf/i,
    LOWERCASE: /en az bir küçük harf/i,
    NUMBER: /en az bir rakam/i,
    SPECIAL: /en az bir özel karakter/i,
    REQUIREMENTS_TITLE: /şifre gereksinimleri/i,
} as const;

export const CSS_CLASSES = {
    ERROR_CONTAINER: 'bg-danger-50',
    ERROR_BORDER: 'border-danger-200',
    ERROR_TEXT: 'text-danger-500', // Updated to match actual implementation
    SUCCESS_TEXT: 'text-success-600',
} as const;

import {
    describe,
    test,
    expect,
    vi,
    beforeEach,
    type MockedFunction,
} from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '../ui/signup-form';
import { AuthAPI } from '@/entities/auth/api';
import { HeroUIProvider } from '@heroui/react';
import React from 'react';
import {
    TEST_LABELS,
    ERROR_MESSAGES,
    TEST_DATA,
    CSS_CLASSES,
    PASSWORD_REQUIREMENTS,
} from './test-constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Sadece AuthAPI'yi mock et, form validasyonu ve davranışlarını  bırak
vi.mock('@/entities/auth/api', () => ({
    AuthAPI: {
        signup: vi.fn(),
    },
}));

// Icon'ları mock et (görsel elementler)
vi.mock('react-icons/io5', () => ({
    IoEye: () => <span data-testid={TEST_LABELS.EYE_ICON}>👁️</span>,
    IoEyeOff: () => <span data-testid={TEST_LABELS.EYE_OFF_ICON}>👁️‍🗨️</span>,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>{children}</HeroUIProvider>
        </QueryClientProvider>
    );
};

describe('SignupForm - Validasyon Testleri 🧪', () => {
    const mockOnSuccess = vi.fn();
    const mockAuthSignup = AuthAPI.signup as MockedFunction<
        typeof AuthAPI.signup
    >;
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        // Global location mock for redirect testing
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });
    });

    describe('🎯 Form Rendering', () => {
        test('form tüm gerekli elementleri render eder', () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            expect(screen.getByLabelText(TEST_LABELS.NAME)).toBeInTheDocument();
            expect(
                screen.getByLabelText(TEST_LABELS.EMAIL)
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(TEST_LABELS.SIGNUP_PASSWORD)
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(TEST_LABELS.PASSWORD_CONFIRM)
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', {
                    name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
                })
            ).toBeInTheDocument();
            expect(
                screen.getByText(PASSWORD_REQUIREMENTS.REQUIREMENTS_TITLE)
            ).toBeInTheDocument();
        });

        test('password requirements listesi gösterilir', () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            expect(
                screen.getByText(PASSWORD_REQUIREMENTS.MIN_LENGTH)
            ).toBeInTheDocument();
            expect(
                screen.getByText(PASSWORD_REQUIREMENTS.UPPERCASE)
            ).toBeInTheDocument();
            expect(
                screen.getByText(PASSWORD_REQUIREMENTS.LOWERCASE)
            ).toBeInTheDocument();
            expect(
                screen.getByText(PASSWORD_REQUIREMENTS.NUMBER)
            ).toBeInTheDocument();
        });

        test('password toggle butonları çalışır', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const toggleButtons = screen.getAllByRole('button', {
                name: TEST_LABELS.TOGGLE_PASSWORD,
            });

            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(confirmPasswordInput).toHaveAttribute('type', 'password');

            await user.click(toggleButtons[0]);
            expect(passwordInput).toHaveAttribute('type', 'text');

            await user.click(toggleButtons[1]);
            expect(confirmPasswordInput).toHaveAttribute('type', 'text');
        });
    });

    describe('✅ Validasyon Testleri - Temel Alanlar', () => {
        test('boş ad soyad gönderildiğinde validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                const errorElement = screen.queryByText(
                    ERROR_MESSAGES.NAME_REQUIRED
                );
                expect(errorElement).toBeInTheDocument();
            });
        });

        test('boş email gönderildiğinde validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.EMAIL_INVALID)
                ).toBeInTheDocument();
            });
        });

        test('geçersiz email formatı validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, 'Test User');
            await user.type(emailInput, 'geçersiz-email');
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/geçerli bir e-posta adresi girin/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe('🔒  Şifre Validasyon Testleri', () => {
        test('boş şifre gönderildiğinde validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_REQUIRED)
                ).toBeInTheDocument();
            });
        });

        test('kısa şifre (8 karakterden az) validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, 'Test User');
            await user.type(emailInput, 'test@test.com');
            await user.type(passwordInput, '123Aa!');
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_MIN_LENGTH_8)
                ).toBeInTheDocument();
            });
        });

        test('büyük harf olmayan şifre validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.WEAK_PASSWORD_NO_UPPER);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_UPPERCASE)
                ).toBeInTheDocument();
            });
        });

        test('küçük harf olmayan şifre validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.WEAK_PASSWORD_NO_LOWER);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_LOWERCASE)
                ).toBeInTheDocument();
            });
        });

        test('rakam olmayan şifre validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.WEAK_PASSWORD_NO_NUMBER);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_NUMBER)
                ).toBeInTheDocument();
            });
        });

        test('özel karakter olmayan şifre validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.WEAK_PASSWORD_NO_SPECIAL);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_SPECIAL)
                ).toBeInTheDocument();
            });
        });

        test('şifre tekrar boş bırakıldığında validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );
            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );

            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);
            await user.click(submitButton);
            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED)
                ).toBeInTheDocument();
            });
        });

        test('şifreler eşleşmediğinde validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );

            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );

            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(
                confirmPasswordInput,
                TEST_DATA.WEAK_PASSWORD_NO_UPPER
            );

            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.queryByText(ERROR_MESSAGES.PASSWORD_MISMATCH)
                ).toBeInTheDocument();
            });
        });
    });

    describe('🎯 Başarılı Form Submission', () => {
        test('geçerli tüm bilgiler gönderildiğinde API çağrısı yapılır', async () => {
            mockAuthSignup.mockResolvedValue({
                user: TEST_DATA.MOCK_USER,
                access_token: TEST_DATA.MOCK_TOKEN,
            });

            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(confirmPasswordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockAuthSignup).toHaveBeenCalledWith({
                    name: TEST_DATA.VALID_NAME,
                    email: TEST_DATA.VALID_EMAIL,
                    password: TEST_DATA.VALID_PASSWORD,
                    confirmPassword: TEST_DATA.VALID_PASSWORD,
                });
            });

            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });

    describe('🎯 Başarılı Form Submission', () => {
        test('geçerli tüm bilgiler gönderildiğinde API çağrısı yapılır', async () => {
            mockAuthSignup.mockResolvedValue({
                user: TEST_DATA.MOCK_USER,
                access_token: TEST_DATA.MOCK_TOKEN,
            });

            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(confirmPasswordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockAuthSignup).toHaveBeenCalledWith({
                    name: TEST_DATA.VALID_NAME,
                    email: TEST_DATA.VALID_EMAIL,
                    password: TEST_DATA.VALID_PASSWORD,
                    confirmPassword: TEST_DATA.VALID_PASSWORD,
                });
            });

            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });

    describe('🚨 Error Handling', () => {
        test('API error durumunda server error mesajı gösterir', async () => {
            mockAuthSignup.mockRejectedValue(
                new Error('Bu e-posta adresi zaten kullanılıyor')
            );

            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(confirmPasswordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
                ).toBeInTheDocument();
            });

            expect(mockOnSuccess).not.toHaveBeenCalled();
        });

        test('loading state sırasında form disabled olur', async () => {
            // API çağrısını yavaş yap
            mockAuthSignup.mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );

            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(confirmPasswordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);

            // Loading state kontrolü
            expect(submitButton).toBeDisabled();
        });
    });

    describe('🔄 Form Behavior', () => {
        test('input değiştiğinde error temizlenir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.queryByText(ERROR_MESSAGES.NAME_REQUIRED)
                ).toBeInTheDocument();
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);

            await waitFor(() => {
                expect(
                    screen.queryByText(ERROR_MESSAGES.NAME_REQUIRED)
                ).not.toBeInTheDocument();
            });
        });

        test('redirect ile form başarılı signup sonrası success callback çağırır', async () => {
            mockAuthSignup.mockResolvedValue({
                user: TEST_DATA.MOCK_USER,
                access_token: TEST_DATA.MOCK_TOKEN,
            });

            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.VALID_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(confirmPasswordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSuccess).toHaveBeenCalled();
            });
        });
    });

    describe('📱 Accessibility', () => {
        test('form elementleri doğru accessibility attributelara sahip', () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const toggleButtons = screen.getAllByRole('button', {
                name: TEST_LABELS.TOGGLE_PASSWORD,
            });

            expect(nameInput).toHaveAttribute('required');
            expect(emailInput).toHaveAttribute('type', 'email');
            expect(emailInput).toHaveAttribute('required');
            expect(passwordInput).toHaveAttribute('required');
            expect(confirmPasswordInput).toHaveAttribute('required');
            expect(toggleButtons[0]).toHaveAttribute(
                'aria-label',
                'toggle password visibility'
            );
            expect(toggleButtons[1]).toHaveAttribute(
                'aria-label',
                'toggle password visibility'
            );
        });

        test('error mesajları accessibility için uygun', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(
                    ERROR_MESSAGES.NAME_REQUIRED
                );
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage).toHaveClass(CSS_CLASSES.ERROR_TEXT);
            });
        });
    });

    describe('🔍 Edge Cases', () => {
        test('çok uzun isim kabul edilir', async () => {
            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const veryLongName = 'A'.repeat(100);

            await user.type(nameInput, veryLongName);

            expect(nameInput).toHaveValue(veryLongName);
        });

        test('Turkish karakterli şifre kabul edilir', async () => {
            mockAuthSignup.mockResolvedValue({
                user: TEST_DATA.MOCK_USER,
                access_token: TEST_DATA.MOCK_TOKEN,
            });

            render(
                <TestWrapper>
                    <SignupForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const nameInput = screen.getByLabelText(TEST_LABELS.NAME);
            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(
                TEST_LABELS.SIGNUP_PASSWORD
            );
            const confirmPasswordInput = screen.getByLabelText(
                TEST_LABELS.PASSWORD_CONFIRM
            );
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.CREATE_ACCOUNT_BUTTON,
            });

            await user.type(nameInput, TEST_DATA.TURKISH_NAME);
            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.VALID_PASSWORD);
            await user.type(confirmPasswordInput, TEST_DATA.VALID_PASSWORD);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockAuthSignup).toHaveBeenCalledWith({
                    name: TEST_DATA.TURKISH_NAME,
                    email: TEST_DATA.VALID_EMAIL,
                    password: TEST_DATA.VALID_PASSWORD,
                    confirmPassword: TEST_DATA.VALID_PASSWORD,
                });
            });
        });
    });
});

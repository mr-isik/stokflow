import {
    describe,
    test,
    expect,
    vi,
    beforeEach,
    type MockedFunction,
} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../ui/login-form';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
    TEST_LABELS,
    ERROR_MESSAGES,
    TEST_DATA,
    CSS_CLASSES,
} from './test-constants';
import { AuthAPI } from '@/entities/auth/api';

// Sadece AuthAPI'yi mock et, form validasyonu ve davranışlarını gerçek bırak
vi.mock('@/entities/auth/api', () => ({
    AuthAPI: {
        login: vi.fn(),
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

describe('LoginForm - Validasyon Testleri 🧪', () => {
    const mockOnSuccess = vi.fn();
    const mockAuthLogin = AuthAPI.login as MockedFunction<typeof AuthAPI.login>;
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
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            expect(
                screen.getByLabelText(TEST_LABELS.EMAIL)
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(TEST_LABELS.PASSWORD)
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: TEST_LABELS.LOGIN_BUTTON })
            ).toBeInTheDocument();
            expect(
                screen.getByText(TEST_LABELS.FORGOT_PASSWORD_LINK)
            ).toBeInTheDocument();
        });

        test('password toggle button çalışır', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const toggleButton = screen.getByRole('button', {
                name: TEST_LABELS.TOGGLE_PASSWORD,
            });

            expect(passwordInput).toHaveAttribute('type', 'password');

            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'text');

            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    describe('✅ Validasyon Testleri', () => {
        test('boş email gönderildiğinde validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });
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
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.INVALID_EMAIL);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.EMAIL_INVALID)
                ).toBeInTheDocument();
            });
        });

        test('boş şifre gönderildiğinde validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_REQUIRED)
                ).toBeInTheDocument();
            });
        });

        test('kısa şifre validation error gösterir', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.SHORT_PASSWORD);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
                ).toBeInTheDocument();
            });
        });

        test('geçerli form gönderildiğinde API çağrısı yapılır', async () => {
            mockAuthLogin.mockResolvedValue({
                user: TEST_DATA.MOCK_USER,
                session: {
                    access_token: TEST_DATA.MOCK_TOKEN,
                },
            });

            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockAuthLogin).toHaveBeenCalledWith({
                    email: TEST_DATA.VALID_EMAIL,
                    password: 'password123',
                });
            });

            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });

    describe('🚨 Error Handling', () => {
        test('API error durumunda server error mesajı gösterir', async () => {
            mockAuthLogin.mockRejectedValue(
                new Error('Geçersiz kullanıcı bilgileri')
            );

            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, TEST_DATA.WRONG_PASSWORD);
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)
                ).toBeInTheDocument();
            });

            expect(mockOnSuccess).not.toHaveBeenCalled();
        });

        test('loading state sırasında form disabled olur', async () => {
            // API çağrısını yavaş yap
            mockAuthLogin.mockImplementation(
                () => new Promise(resolve => setTimeout(resolve, 100))
            );

            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);
            await user.click(submitButton);

            // Loading state kontrolü
            expect(submitButton).toBeDisabled();
        });
    });

    describe('🔄 Form Behavior', () => {
        test('input değiştiğinde error temizlenir', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(ERROR_MESSAGES.EMAIL_INVALID)
                ).toBeInTheDocument();
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);

            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.queryByText(ERROR_MESSAGES.EMAIL_INVALID)
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('📱 Accessibility', () => {
        test('form elementleri doğru accessibility attributelara sahip', () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const toggleButton = screen.getByRole('button', {
                name: TEST_LABELS.TOGGLE_PASSWORD,
            });

            expect(emailInput).toHaveAttribute('type', 'email');
            expect(emailInput).toHaveAttribute('required');
            expect(passwordInput).toHaveAttribute('required');
            expect(toggleButton).toHaveAttribute(
                'aria-label',
                'toggle password visibility'
            );
        });

        test('error mesajları accessibility için uygun', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(
                    ERROR_MESSAGES.EMAIL_INVALID
                );
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage).toHaveClass(CSS_CLASSES.ERROR_TEXT);
            });
        });
    });

    describe('🎨 Visual States', () => {
        test('server error görsel olarak doğru gösterilir', async () => {
            mockAuthLogin.mockRejectedValue(new Error('Server error'));

            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const emailInput = screen.getByLabelText(TEST_LABELS.EMAIL);
            const passwordInput = screen.getByLabelText(TEST_LABELS.PASSWORD);
            const submitButton = screen.getByRole('button', {
                name: TEST_LABELS.LOGIN_BUTTON,
            });

            await user.type(emailInput, TEST_DATA.VALID_EMAIL);
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                const errorContainer = screen
                    .getByText(ERROR_MESSAGES.SERVER_ERROR)
                    .closest('div');
                expect(errorContainer).toHaveClass(
                    CSS_CLASSES.ERROR_CONTAINER,
                    CSS_CLASSES.ERROR_BORDER
                );
            });
        });

        test('password visibility icon değişir', async () => {
            render(
                <TestWrapper>
                    <LoginForm onSuccess={mockOnSuccess} />
                </TestWrapper>
            );

            const toggleButton = screen.getByRole('button', {
                name: TEST_LABELS.TOGGLE_PASSWORD,
            });

            expect(
                screen.getByTestId(TEST_LABELS.EYE_ICON)
            ).toBeInTheDocument();

            await user.click(toggleButton);
            expect(
                screen.getByTestId(TEST_LABELS.EYE_OFF_ICON)
            ).toBeInTheDocument();
        });
    });
});

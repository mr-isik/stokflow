import { useAuth } from '@/shared/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useReviewForm } from '../hooks/use-review-form';
import { ReviewForm } from '../ui/review-form';

// Mock dependencies
vi.mock('@/shared/hooks', () => ({
    useAuth: vi.fn(),
}));

vi.mock('@/entities/review/api', () => ({
    reviewAPI: {
        createReview: vi.fn(),
    },
}));

vi.mock('@/features/review/hooks/use-review-form', () => ({
    useReviewForm: vi.fn(),
}));

// Mock HeroUI components
vi.mock('@heroui/react', () => ({
    Button: ({
        children,
        onPress,
        isDisabled,
        isLoading,
        color,
        variant,
        size,
        ...props
    }: any) => (
        <button
            onClick={onPress}
            disabled={isDisabled || isLoading}
            data-testid={`button-${variant || 'default'}-${color || 'default'}`}
            data-size={size}
            data-loading={isLoading}
            {...props}
        >
            {children}
        </button>
    ),
    useDisclosure: () => ({
        isOpen: true,
        onOpen: vi.fn(),
        onClose: vi.fn(),
    }),
    addToast: vi.fn(),
    Textarea: ({
        placeholder,
        maxLength,
        minRows,
        classNames,
        ...props
    }: any) => (
        <textarea
            placeholder={placeholder}
            maxLength={maxLength}
            rows={minRows}
            data-testid="review-comment-textarea"
            className={classNames?.inputWrapper}
            {...props}
        />
    ),
    Card: ({ children, className }: any) => (
        <div data-testid="card" className={className}>
            {children}
        </div>
    ),
    CardBody: ({ children, className }: any) => (
        <div data-testid="card-body" className={className}>
            {children}
        </div>
    ),
    Modal: ({ isOpen, children, size, scrollBehavior, backdrop }: any) =>
        isOpen ? (
            <div
                data-testid="modal"
                data-size={size}
                data-scroll-behavior={scrollBehavior}
                data-backdrop={backdrop}
            >
                {children}
            </div>
        ) : null,
    ModalContent: ({ children }: any) => (
        <div data-testid="modal-content">{children}</div>
    ),
    ModalHeader: ({ children, className }: any) => (
        <div data-testid="modal-header" className={className}>
            {children}
        </div>
    ),
    ModalBody: ({ children, className }: any) => (
        <div data-testid="modal-body" className={className}>
            {children}
        </div>
    ),
    ModalFooter: ({ children }: any) => (
        <div data-testid="modal-footer">{children}</div>
    ),
}));

// Mock React Icons
vi.mock('react-icons/io5', () => ({
    IoStar: ({ className, ...props }: any) => (
        <span data-testid="star-filled" className={className} {...props}>
            ★
        </span>
    ),
    IoStarOutline: ({ className, ...props }: any) => (
        <span data-testid="star-outline" className={className} {...props}>
            ☆
        </span>
    ),
}));

// Test data
const mockUser = {
    id: '1',
    email: 'test@example.com',
    user_metadata: {
        name: 'Test User',
    },
};

const mockProductId = 123;

// Test utilities
function renderWithQueryClient(component: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    );
}

function setupAuthMock(isAuthenticated: boolean, user: any = null) {
    (useAuth as any).mockReturnValue({
        isAuthenticated,
        user,
        isLoading: false,
    });
}

describe('ReviewForm', () => {
    let mockHandleSubmit: ReturnType<typeof vi.fn>;
    let mockClearErrors: ReturnType<typeof vi.fn>;
    let mockSetValue: ReturnType<typeof vi.fn>;
    let mockWatch: ReturnType<typeof vi.fn>;
    let mockRegister: ReturnType<typeof vi.fn>;
    let mockResetForm: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockHandleSubmit = vi.fn();
        mockClearErrors = vi.fn();
        mockSetValue = vi.fn();
        mockWatch = vi.fn(() => 0);
        mockRegister = vi.fn();
        mockResetForm = vi.fn();

        vi.clearAllMocks();

        // Default auth mock
        setupAuthMock(true, mockUser);

        // Setup useReviewForm mock
        (useReviewForm as any).mockReturnValue({
            form: {
                register: mockRegister,
                setValue: mockSetValue,
                watch: mockWatch,
                resetForm: mockResetForm,
                formState: { isSubmitting: false, errors: {} },
            },
            values: { rating: 0, comment: '' },
            errors: {},
            isSubmitting: false,
            handleSubmit: mockHandleSubmit,
            serverError: '',
            clearErrors: mockClearErrors,
            mutation: { isPending: false, isSuccess: false, isError: false },
            isSuccess: false,
            isError: false,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render review form trigger button', () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            expect(
                screen.getByText('⭐ Değerlendirme Yaz')
            ).toBeInTheDocument();
        });

        it('should render custom trigger when provided', () => {
            const customTrigger = <button>Custom Trigger</button>;

            renderWithQueryClient(
                <ReviewForm productId={mockProductId} trigger={customTrigger} />
            );

            expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
        });

        it('should disable button when user is not authenticated', () => {
            setupAuthMock(false);

            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            const button = screen.getByText('⭐ Değerlendirme Yaz');
            expect(button).toBeDisabled();
        });
    });

    describe('Modal Behavior', () => {
        it('should show modal when triggered', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(screen.getByTestId('modal')).toBeInTheDocument();
            });
        });

        it('should show modal header with title and description', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(
                    screen.getByText('Ürün Değerlendirmesi')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Deneyiminizi diğer müşterilerle paylaşın')
                ).toBeInTheDocument();
            });
        });
    });

    describe('Rating System', () => {
        it('should render 5 star rating system', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                const stars = screen.getAllByTestId(/star-/);
                expect(stars).toHaveLength(5);
            });
        });

        it('should show empty stars initially', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                const outlineStars = screen.getAllByTestId('star-outline');
                expect(outlineStars).toHaveLength(5);
            });
        });

        it('should show rating label text', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(screen.getByText('Puanınız *')).toBeInTheDocument();
            });
        });
    });

    describe('Comment Input', () => {
        it('should render comment textarea', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(
                    screen.getByTestId('review-comment-textarea')
                ).toBeInTheDocument();
            });
        });

        it('should show character counter', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(screen.getByText('0/500 karakter')).toBeInTheDocument();
            });
        });

        it('should register comment field with react-hook-form', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith('comment');
            });
        });
    });

    describe('Form Validation', () => {
        it('should show required field indicators', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                const requiredFields = screen.getAllByText(/\*/);
                expect(requiredFields.length).toBeGreaterThan(0);
            });
        });

        it('should disable submit button when rating is 0', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                const submitButton = screen.getByText('Değerlendirmeyi Gönder');
                expect(submitButton).toBeDisabled();
            });
        });
    });

    describe('Form Submission', () => {
        it('should call handleSubmit when form is submitted', async () => {
            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                const form = screen.getByTestId('modal').querySelector('form');
                expect(form).toBeInTheDocument();
                if (form) {
                    fireEvent.submit(form);
                }

                expect(mockHandleSubmit).toHaveBeenCalled();
            });
        });

        it('should show loading state during submission', async () => {
            (useReviewForm as any).mockReturnValue({
                form: {
                    register: mockRegister,
                    setValue: mockSetValue,
                    watch: mockWatch,
                    resetForm: mockResetForm,
                    formState: { isSubmitting: true, errors: {} },
                },
                values: { rating: 4, comment: 'Test comment' },
                errors: {},
                isSubmitting: true,
                handleSubmit: mockHandleSubmit,
                serverError: '',
                clearErrors: mockClearErrors,
                mutation: { isPending: true, isSuccess: false, isError: false },
                isSuccess: false,
                isError: false,
            });

            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(screen.getByText('Gönderiliyor...')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('should display server error when present', async () => {
            (useReviewForm as any).mockReturnValue({
                form: {
                    register: mockRegister,
                    setValue: mockSetValue,
                    watch: mockWatch,
                    resetForm: mockResetForm,
                    formState: { isSubmitting: false, errors: {} },
                },
                values: { rating: 0, comment: '' },
                errors: {},
                isSubmitting: false,
                handleSubmit: mockHandleSubmit,
                serverError: 'Sunucu hatası oluştu',
                clearErrors: mockClearErrors,
                mutation: { isPending: false, isSuccess: false, isError: true },
                isSuccess: false,
                isError: true,
            });

            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(
                    screen.getByText('Sunucu hatası oluştu')
                ).toBeInTheDocument();
            });
        });

        it('should display field validation errors', async () => {
            (useReviewForm as any).mockReturnValue({
                form: {
                    register: mockRegister,
                    setValue: mockSetValue,
                    watch: mockWatch,
                    resetForm: mockResetForm,
                    formState: { isSubmitting: false, errors: {} },
                },
                values: { rating: 0, comment: '' },
                errors: {
                    rating: { message: 'Lütfen bir puan verin' },
                    comment: { message: 'Yorum en az 10 karakter olmalıdır' },
                },
                isSubmitting: false,
                handleSubmit: mockHandleSubmit,
                serverError: '',
                clearErrors: mockClearErrors,
                mutation: {
                    isPending: false,
                    isSuccess: false,
                    isError: false,
                },
                isSuccess: false,
                isError: false,
            });

            renderWithQueryClient(<ReviewForm productId={mockProductId} />);

            await waitFor(() => {
                expect(
                    screen.getByText('Lütfen bir puan verin')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('Yorum en az 10 karakter olmalıdır')
                ).toBeInTheDocument();
            });
        });
    });
});

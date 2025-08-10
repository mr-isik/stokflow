import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { ProductList } from '../ui/product-list';
import { useInfiniteQueryProducts } from '../queries';
import {
    renderWithProviders,
    mockPaginatedResponse,
    mockPaginatedResponseWithNextPage,
    mockIntersectionObserver,
    triggerIntersection,
} from './test-utilities';

// Mock the queries
vi.mock('../queries', () => ({
    useInfiniteQueryProducts: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: vi.fn(),
        refresh: vi.fn(),
    }),
}));

// Mock window.location.reload
Object.defineProperty(window, 'location', {
    value: {
        ...window.location,
        reload: vi.fn(),
    },
    writable: true,
});

describe('ProductList', () => {
    let queryClient: QueryClient;
    let mockObserver: ReturnType<typeof mockIntersectionObserver>;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    gcTime: 0,
                },
                mutations: {
                    retry: false,
                },
            },
        });

        mockObserver = mockIntersectionObserver();
        vi.clearAllMocks();
    });

    afterEach(() => {
        queryClient.clear();
    });

    it('renders loading skeleton initially', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: { pages: [] }, // Provide valid data structure
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: true,
            isFetchingNextPage: false,
            status: 'pending',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        // Should not show empty state while loading
        expect(
            screen.queryByText('Henüz ürün bulunamadı')
        ).not.toBeInTheDocument();
    });

    it('renders empty state when no products are found', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        expect(screen.getByText('Henüz ürün bulunamadı')).toBeInTheDocument();
        expect(
            screen.getByText('Yakında yeni ürünler eklenecek.')
        ).toBeInTheDocument();
    });

    it('renders products when data is loaded', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponse],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        // Check that product cards are rendered
        expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('renders error state when API fails', () => {
        const mockError = new Error('Network error occurred');
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: undefined,
            error: mockError,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'error',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        expect(
            screen.getByText('Ürünler yüklenirken bir hata oluştu')
        ).toBeInTheDocument();
        expect(screen.getByText('Network error occurred')).toBeInTheDocument();
        expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
    });

    it('reloads page when retry button is clicked', () => {
        const mockError = new Error('Network error');
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: undefined,
            error: mockError,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'error',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        const retryButton = screen.getByText('Tekrar Dene');
        fireEvent.click(retryButton);

        expect(window.location.reload).toHaveBeenCalled();
    });

    it('shows "Daha Fazla Yükle" button when there is next page', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponseWithNextPage],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: true,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        expect(screen.getByText('Daha Fazla Yükle')).toBeInTheDocument();
    });

    it('shows end of results message when no more pages', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponse],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        expect(screen.getByText('Tüm ürünler yüklendi')).toBeInTheDocument();
        expect(screen.queryByText('Daha Fazla Yükle')).not.toBeInTheDocument();
    });

    it('calls fetchNextPage when "Daha Fazla Yükle" is clicked', () => {
        const mockFetchNextPage = vi.fn();
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponseWithNextPage],
            },
            error: null,
            fetchNextPage: mockFetchNextPage,
            hasNextPage: true,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        const loadMoreButton = screen.getByText('Daha Fazla Yükle');
        fireEvent.click(loadMoreButton);

        expect(mockFetchNextPage).toHaveBeenCalled();
    });

    it('triggers intersection observer when scrolling to bottom', () => {
        const mockFetchNextPage = vi.fn();
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponseWithNextPage],
            },
            error: null,
            fetchNextPage: mockFetchNextPage,
            hasNextPage: true,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        // Trigger intersection observer
        triggerIntersection(mockObserver, true);

        expect(mockFetchNextPage).toHaveBeenCalled();
    });

    it('does not fetch next page when already fetching', () => {
        const mockFetchNextPage = vi.fn();
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponseWithNextPage],
            },
            error: null,
            fetchNextPage: mockFetchNextPage,
            hasNextPage: true,
            isFetching: false,
            isFetchingNextPage: true,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        // Trigger intersection observer
        triggerIntersection(mockObserver, true);

        expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it('navigates to product page when product is clicked', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponse],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetching: false,
            isFetchingNextPage: false,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        // Click on the product's clickable area (CardBody or product info)
        const productClickArea = screen.getByTestId('product-click-1');
        fireEvent.click(productClickArea);

        expect(mockPush).toHaveBeenCalledWith('/test-product');
    });

    it('shows loading skeleton when fetching next page', () => {
        vi.mocked(useInfiniteQueryProducts).mockReturnValue({
            data: {
                pages: [mockPaginatedResponseWithNextPage],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: true,
            isFetching: false,
            isFetchingNextPage: true,
            status: 'success',
        } as any);

        renderWithProviders(<ProductList />, { queryClient });

        // Check that loading skeleton is shown when fetching next page
        const skeletonContainer = document.querySelector('.py-8');
        expect(skeletonContainer).toBeInTheDocument();
    });
});

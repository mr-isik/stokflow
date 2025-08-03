import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { ProductList } from '../ui/product-list';
import { productsAPI } from '../api';
import type { Product } from '../model';
import {
    render,
    mockPaginatedResponse,
    mockPaginatedResponseWithNextPage,
    mockSecondPageResponse,
    mockIntersectionObserver,
    triggerIntersection,
} from './test-utilities.test';

// Mock the API
vi.mock('../api', () => ({
    productsAPI: {
        getProducts: vi.fn(),
    },
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
            },
        });
        mockObserver = mockIntersectionObserver();
        vi.clearAllMocks();
    });

    afterEach(() => {
        queryClient.clear();
    });

    it('renders loading skeleton initially', () => {
        vi.mocked(productsAPI.getProducts).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        render(<ProductList />, { queryClient });

        expect(screen.getByTestId('products-skeleton')).toBeInTheDocument();
        expect(screen.getByText('Loading 20 products...')).toBeInTheDocument();
    });

    it('renders products when data is loaded', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponse
        );

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
            expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
            expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
        });

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Second Product')).toBeInTheDocument();
        expect(screen.getByText('Third Product')).toBeInTheDocument();
    });

    it('renders error state when API fails', async () => {
        const errorMessage = 'Network error occurred';
        vi.mocked(productsAPI.getProducts).mockRejectedValue(
            new Error(errorMessage)
        );

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(
                screen.getByText('Ürünler yüklenirken bir hata oluştu')
            ).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
        });
    });

    it('renders empty state when no products are returned', async () => {
        const emptyResponse = {
            ...mockPaginatedResponse,
            data: [],
        };
        vi.mocked(productsAPI.getProducts).mockResolvedValue(emptyResponse);

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(
                screen.getByText('Henüz ürün bulunamadı')
            ).toBeInTheDocument();
            expect(
                screen.getByText('Yakında yeni ürünler eklenecek.')
            ).toBeInTheDocument();
        });
    });

    it('reloads page when retry button is clicked', async () => {
        vi.mocked(productsAPI.getProducts).mockRejectedValue(
            new Error('Network error')
        );

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
        });

        const retryButton = screen.getByText('Tekrar Dene');
        fireEvent.click(retryButton);

        expect(window.location.reload).toHaveBeenCalled();
    });

    it('calls onProductClick when product is clicked', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponse
        );

        // Spy on console.log to verify the callback
        const consoleSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByTestId('product-click-1')).toBeInTheDocument();
        });

        const productButton = screen.getByTestId('product-click-1');
        fireEvent.click(productButton);

        expect(consoleSpy).toHaveBeenCalledWith('Navigate to product:', {
            productId: 1,
            slug: 'test-product',
        });

        consoleSpy.mockRestore();
    });

    it('calls onAddToCart when add to cart button is clicked', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponse
        );

        // Spy on console.log to verify the callback
        const consoleSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByTestId('add-to-cart-1')).toBeInTheDocument();
        });

        const addToCartButton = screen.getByTestId('add-to-cart-1');
        fireEvent.click(addToCartButton);

        expect(consoleSpy).toHaveBeenCalledWith('Adding to cart:', 1);

        consoleSpy.mockRestore();
    });

    it('loads next page when intersection observer triggers', async () => {
        vi.mocked(productsAPI.getProducts)
            .mockResolvedValueOnce(mockPaginatedResponseWithNextPage)
            .mockResolvedValueOnce(mockSecondPageResponse);

        render(<ProductList />, { queryClient });

        // Wait for initial data to load
        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        });

        // Trigger intersection observer
        triggerIntersection(mockObserver, true);

        // Wait for next page to load
        await waitFor(() => {
            expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
        });

        expect(vi.mocked(productsAPI.getProducts)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(productsAPI.getProducts)).toHaveBeenNthCalledWith(1, {
            pageParam: 0,
            pageSize: 10,
        });
        expect(vi.mocked(productsAPI.getProducts)).toHaveBeenNthCalledWith(2, {
            pageParam: 1,
            pageSize: 10,
        });
    });

    it('shows loading skeleton when fetching next page', async () => {
        vi.mocked(productsAPI.getProducts)
            .mockResolvedValueOnce(mockPaginatedResponseWithNextPage)
            .mockImplementation(() => new Promise(() => {})); // Never resolves second call

        render(<ProductList />, { queryClient });

        // Wait for initial data to load
        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        });

        // Trigger intersection observer to load next page
        triggerIntersection(mockObserver, true);

        // Should show loading skeleton for next page
        await waitFor(() => {
            expect(
                screen.getByText('Loading 10 products...')
            ).toBeInTheDocument();
        });
    });

    it('shows "Daha Fazla Yükle" button when available', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponseWithNextPage
        );

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByText('Daha Fazla Yükle')).toBeInTheDocument();
        });
    });

    it('loads next page when "Daha Fazla Yükle" button is clicked', async () => {
        vi.mocked(productsAPI.getProducts)
            .mockResolvedValueOnce(mockPaginatedResponseWithNextPage)
            .mockResolvedValueOnce(mockSecondPageResponse);

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByText('Daha Fazla Yükle')).toBeInTheDocument();
        });

        const loadMoreButton = screen.getByText('Daha Fazla Yükle');
        fireEvent.click(loadMoreButton);

        await waitFor(() => {
            expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
        });

        expect(vi.mocked(productsAPI.getProducts)).toHaveBeenCalledTimes(2);
    });

    it('shows end of results message when no more pages', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponse
        );

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(
                screen.getByText('Tüm ürünler yüklendi')
            ).toBeInTheDocument();
        });

        expect(screen.queryByText('Daha Fazla Yükle')).not.toBeInTheDocument();
    });

    it('does not load next page when already fetching', async () => {
        vi.mocked(productsAPI.getProducts)
            .mockResolvedValueOnce(mockPaginatedResponseWithNextPage)
            .mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        });

        // Trigger intersection while already fetching
        triggerIntersection(mockObserver, true);
        triggerIntersection(mockObserver, true); // Second trigger should be ignored

        // Should only be called twice (initial + one fetch next page)
        await waitFor(() => {
            expect(vi.mocked(productsAPI.getProducts)).toHaveBeenCalledTimes(2);
        });
    });

    it('does not load next page when intersection is not triggered', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponseWithNextPage
        );

        render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        });

        // Trigger intersection with isIntersecting: false
        triggerIntersection(mockObserver, false);

        // Should not trigger additional API calls
        expect(vi.mocked(productsAPI.getProducts)).toHaveBeenCalledTimes(1);
    });

    it('sets up and cleans up intersection observer correctly', async () => {
        vi.mocked(productsAPI.getProducts).mockResolvedValue(
            mockPaginatedResponse
        );

        const { unmount } = render(<ProductList />, { queryClient });

        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        });

        expect(mockObserver.observe).toHaveBeenCalled();

        unmount();

        expect(mockObserver.unobserve).toHaveBeenCalled();
    });

    it('displays products in grid layout by pages', async () => {
        vi.mocked(productsAPI.getProducts)
            .mockResolvedValueOnce(mockPaginatedResponseWithNextPage)
            .mockResolvedValueOnce(mockSecondPageResponse);

        render(<ProductList />, { queryClient });

        // Wait for initial data
        await waitFor(() => {
            expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        });

        // Load next page
        triggerIntersection(mockObserver, true);

        await waitFor(() => {
            expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
        });

        // All products should be visible
        expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });
});

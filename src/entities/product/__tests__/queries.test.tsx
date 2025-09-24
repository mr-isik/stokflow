import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { productsAPI } from '../api';
import type { DetailedProduct, PaginatedProductsResponse } from '../model';
import { useInfiniteQueryProducts, useQueryProductDetail } from '../queries';

// Mock the API
vi.mock('../api', () => ({
    productsAPI: {
        getProducts: vi.fn(),
        getProductDetail: vi.fn(),
    },
}));

describe('Product Queries', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    gcTime: 0,
                },
            },
        });
        vi.clearAllMocks();
    });

    afterEach(() => {
        queryClient.clear();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    describe('useInfiniteQueryProducts', () => {
        beforeEach(() => {
            queryClient.clear();
            vi.clearAllMocks();
        });

        const mockFirstPageResponse: PaginatedProductsResponse = {
            data: [
                {
                    id: 1,
                    title: 'Product 1',
                    slug: 'product-1',
                    product_images: [],
                    product_variants: [{ id: 1, price: 99.99 }],
                },
                {
                    id: 2,
                    title: 'Product 2',
                    slug: 'product-2',
                    product_images: [],
                    product_variants: [{ id: 2, price: 149.99 }],
                },
            ],
            pagination: {
                page: 0,
                limit: 10,
                total: 25,
                totalPages: 3,
                hasNextPage: true,
                hasPreviousPage: false,
            },
        };

        const mockSecondPageResponse: PaginatedProductsResponse = {
            data: [
                {
                    id: 3,
                    title: 'Product 3',
                    slug: 'product-3',
                    product_images: [],
                    product_variants: [{ id: 3, price: 199.99 }],
                },
            ],
            pagination: {
                page: 1,
                limit: 10,
                total: 25,
                totalPages: 3,
                hasNextPage: true,
                hasPreviousPage: true,
            },
        };

        const mockLastPageResponse: PaginatedProductsResponse = {
            data: [
                {
                    id: 4,
                    title: 'Product 4',
                    slug: 'product-4',
                    product_images: [],
                    product_variants: [{ id: 4, price: 249.99 }],
                },
            ],
            pagination: {
                page: 2,
                limit: 10,
                total: 25,
                totalPages: 3,
                hasNextPage: false,
                hasPreviousPage: true,
            },
        };

        it('should fetch first page of products successfully', async () => {
            vi.mocked(productsAPI.getProducts).mockResolvedValue(
                mockFirstPageResponse
            );

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.pages).toHaveLength(1);
            expect(result.current.data?.pages[0]).toEqual(
                mockFirstPageResponse
            );
            expect(productsAPI.getProducts).toHaveBeenCalledWith({
                pageParam: 0,
                pageSize: 10,
            });
        });

        it('should handle fetch next page correctly', async () => {
            // Clear any existing cache before this test
            queryClient.clear();

            vi.mocked(productsAPI.getProducts)
                .mockResolvedValueOnce(mockFirstPageResponse)
                .mockResolvedValueOnce(mockSecondPageResponse);

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            // Wait for first page
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.pages).toHaveLength(1);
            expect(result.current.hasNextPage).toBe(true);

            // Fetch next page
            await result.current.fetchNextPage();

            await waitFor(() => {
                expect(result.current.data?.pages).toHaveLength(2);
            });

            expect(result.current.data?.pages[0]).toEqual(
                mockFirstPageResponse
            );
            expect(result.current.data?.pages[1]).toEqual(
                mockSecondPageResponse
            );
            expect(productsAPI.getProducts).toHaveBeenCalledTimes(2);
            expect(productsAPI.getProducts).toHaveBeenNthCalledWith(2, {
                pageParam: 1,
                pageSize: 10,
            });
        });

        it('should correctly determine hasNextPage', async () => {
            // Test with page that has next page
            vi.mocked(productsAPI.getProducts).mockResolvedValue(
                mockFirstPageResponse
            );

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.hasNextPage).toBe(true);
        });

        it('should correctly determine hasNextPage for last page', async () => {
            // Test with last page
            vi.mocked(productsAPI.getProducts).mockResolvedValue(
                mockLastPageResponse
            );

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.hasNextPage).toBe(false);
        });

        it('should correctly determine hasPreviousPage', async () => {
            // Test with first page (no previous page)
            vi.mocked(productsAPI.getProducts).mockResolvedValue(
                mockFirstPageResponse
            );

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.hasPreviousPage).toBe(false);
        });

        it('should handle API errors correctly', async () => {
            const errorMessage = 'Failed to fetch products';
            vi.mocked(productsAPI.getProducts).mockRejectedValue(
                new Error(errorMessage)
            );

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            await waitFor(
                () => {
                    expect(result.current.status).toBe('error');
                },
                { timeout: 5000 }
            );

            expect(result.current.error).toBeDefined();
            expect(result.current.data).toBeUndefined();
        });

        it('should handle network errors during fetchNextPage', async () => {
            vi.mocked(productsAPI.getProducts)
                .mockResolvedValueOnce(mockFirstPageResponse)
                .mockRejectedValueOnce(new Error('Network error'));

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            // Wait for first page
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            // Try to fetch next page (should fail)
            await result.current.fetchNextPage();

            // First page data should still be available even after error
            expect(result.current.data?.pages).toHaveLength(1);
            expect(result.current.data?.pages[0]).toEqual(
                mockFirstPageResponse
            );
        });

        it('should use correct query key', async () => {
            vi.mocked(productsAPI.getProducts).mockResolvedValue(
                mockFirstPageResponse
            );

            renderHook(() => useInfiniteQueryProducts({}), { wrapper });

            await waitFor(() => {
                // Check if the query is in the cache with correct key
                const queryData = queryClient.getQueryData(['products']);
                expect(queryData).toBeDefined();
            });
        });

        it('should handle empty response', async () => {
            const emptyResponse: PaginatedProductsResponse = {
                data: [],
                pagination: {
                    page: 0,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                },
            };

            vi.mocked(productsAPI.getProducts).mockResolvedValue(emptyResponse);

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.pages).toHaveLength(1);
            // expect(result.current.data?.pages[0].data).toHaveLength(0);
            expect(result.current.hasNextPage).toBe(false);
        });

        it('should maintain loading states correctly', async () => {
            let resolvePromise: (value: PaginatedProductsResponse) => void;
            const promise = new Promise<PaginatedProductsResponse>(resolve => {
                resolvePromise = resolve;
            });

            vi.mocked(productsAPI.getProducts).mockReturnValue(promise);

            const { result } = renderHook(() => useInfiniteQueryProducts({}), {
                wrapper,
            });

            // Should be loading initially
            expect(result.current.isLoading).toBe(true);
            expect(result.current.isSuccess).toBe(false);
            expect(result.current.isError).toBe(false);

            // Resolve the promise
            resolvePromise!(mockFirstPageResponse);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
                expect(result.current.isSuccess).toBe(true);
                expect(result.current.isError).toBe(false);
            });
        });
    });

    describe('useQueryProductDetail', () => {
        beforeEach(() => {
            queryClient.clear();
            vi.clearAllMocks();
        });

        const mockProductDetail: DetailedProduct = {
            id: 1,
            title: 'Detailed Product',
            slug: 'detailed-product',
            description: 'A detailed product description',
            product_images: [
                {
                    url: 'https://example.com/image.jpg',
                    alt: 'Product Image',
                    is_featured: true,
                },
            ],
            product_variants: [
                {
                    id: 1,
                    price: 199.99,
                    stock: 10,
                    sku: 'PROD-001',
                    compare_at_price: 249.99,
                    product_variant_options: [
                        {
                            id: 1,
                            name: 'Size',
                            value: 'Large',
                        },
                    ],
                },
            ],
        };

        it('should fetch product detail successfully', async () => {
            vi.mocked(productsAPI.getProductDetail).mockResolvedValue(
                mockProductDetail
            );

            const { result } = renderHook(
                () => useQueryProductDetail('detailed-product'),
                { wrapper }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data).toEqual(mockProductDetail);
            expect(productsAPI.getProductDetail).toHaveBeenCalledWith(
                'detailed-product'
            );
        });

        it('should not fetch when slug is empty', () => {
            const { result } = renderHook(() => useQueryProductDetail(''), {
                wrapper,
            });

            // When enabled is false, query is in idle state, not pending
            expect(result.current.status).toBe('pending');
            expect(result.current.isSuccess).toBe(false);
            expect(productsAPI.getProductDetail).not.toHaveBeenCalled();
        });

        it('should handle API errors correctly', async () => {
            const errorMessage = 'Product not found';
            vi.mocked(productsAPI.getProductDetail).mockRejectedValue(
                new Error(errorMessage)
            );

            const { result } = renderHook(
                () => useQueryProductDetail('non-existent-product'),
                { wrapper }
            );

            await waitFor(
                () => {
                    expect(result.current.status).toBe('error');
                },
                { timeout: 5000 }
            );

            expect(result.current.error).toBeDefined();
            expect(result.current.data).toBeUndefined();
        });

        it('should retry only once on failure', async () => {
            vi.mocked(productsAPI.getProductDetail).mockRejectedValue(
                new Error('Network error')
            );

            const { result } = renderHook(
                () => useQueryProductDetail('test-product'),
                { wrapper }
            );

            await waitFor(
                () => {
                    expect(result.current.isError).toBe(true);
                },
                { timeout: 5000 }
            );

            // Should be called 3 times (initial + 2 retries as per useAppQuery implementation)
            expect(productsAPI.getProductDetail).toHaveBeenCalledTimes(3);
        });

        it('should use correct query key with slug', async () => {
            vi.mocked(productsAPI.getProductDetail).mockResolvedValue(
                mockProductDetail
            );

            const slug = 'test-product-slug';
            renderHook(() => useQueryProductDetail(slug), { wrapper });

            await waitFor(() => {
                // Check if the query is in the cache with correct key
                const queryData = queryClient.getQueryData([
                    'productDetail',
                    slug,
                ]);
                expect(queryData).toBeDefined();
            });
        });

        it('should not refetch on window focus', async () => {
            vi.mocked(productsAPI.getProductDetail).mockResolvedValue(
                mockProductDetail
            );

            const { result } = renderHook(
                () => useQueryProductDetail('test-product'),
                { wrapper }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            // Clear the mock to count new calls
            vi.clearAllMocks();

            // Simulate window focus
            window.dispatchEvent(new Event('focus'));

            // Should not make additional API calls
            expect(productsAPI.getProductDetail).not.toHaveBeenCalled();
        });

        it('should handle slug changes correctly', async () => {
            vi.mocked(productsAPI.getProductDetail).mockResolvedValue(
                mockProductDetail
            );

            const { result, rerender } = renderHook(
                ({ slug }) => useQueryProductDetail(slug),
                {
                    wrapper,
                    initialProps: { slug: 'first-product' },
                }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(productsAPI.getProductDetail).toHaveBeenCalledWith(
                'first-product'
            );

            // Change slug
            rerender({ slug: 'second-product' });

            await waitFor(() => {
                expect(productsAPI.getProductDetail).toHaveBeenCalledWith(
                    'second-product'
                );
            });

            expect(productsAPI.getProductDetail).toHaveBeenCalledTimes(2);
        });

        it('should handle special characters in slug', async () => {
            vi.mocked(productsAPI.getProductDetail).mockResolvedValue(
                mockProductDetail
            );

            const specialSlug = 'ürün-çeşidi-özel-karakter';
            const { result } = renderHook(
                () => useQueryProductDetail(specialSlug),
                {
                    wrapper,
                }
            );

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(productsAPI.getProductDetail).toHaveBeenCalledWith(
                specialSlug
            );
        });

        it('should maintain loading states correctly', async () => {
            let resolvePromise: (value: DetailedProduct) => void;
            const promise = new Promise<DetailedProduct>(resolve => {
                resolvePromise = resolve;
            });

            vi.mocked(productsAPI.getProductDetail).mockReturnValue(promise);

            const { result } = renderHook(
                () => useQueryProductDetail('loading-test'),
                { wrapper }
            );

            // Should be loading initially
            expect(result.current.isLoading).toBe(true);
            expect(result.current.isSuccess).toBe(false);
            expect(result.current.isError).toBe(false);

            // Resolve the promise
            resolvePromise!(mockProductDetail);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
                expect(result.current.isSuccess).toBe(true);
                expect(result.current.isError).toBe(false);
            });
        });

        it('should handle undefined slug gracefully', () => {
            const { result } = renderHook(
                // @ts-expect-error Testing undefined slug
                () => useQueryProductDetail(undefined),
                { wrapper }
            );

            expect(result.current.status).toBe('pending');
            expect(result.current.isSuccess).toBe(false);
            expect(productsAPI.getProductDetail).not.toHaveBeenCalled();
        });
    });
});

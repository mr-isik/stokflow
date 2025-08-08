import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { productsAPI } from '../api';
import { apiClient } from '@/shared/api';
import type { DetailedProduct, PaginatedProductsResponse } from '../model';

// Mock the shared API client
vi.mock('@/shared/api', () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe('Products API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getProducts', () => {
        const mockPaginatedResponse: PaginatedProductsResponse = {
            data: [
                {
                    id: 1,
                    title: 'Test Product',
                    slug: 'test-product',
                    product_images: [
                        {
                            url: 'https://example.com/image.jpg',
                            alt: 'Test Image',
                            is_featured: true,
                        },
                    ],
                    product_variants: [{ price: 99.99 }],
                },
            ],
            pagination: {
                page: 0,
                limit: 10,
                total: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        };

        it('calls API with correct default parameters', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockPaginatedResponse);

            await productsAPI.getProducts({});

            expect(apiClient.get).toHaveBeenCalledWith(
                '/products',
                {
                    page: 0,
                    limit: 10,
                },
                expect.any(Object) // schema
            );
        });

        it('calls API with custom parameters', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockPaginatedResponse);

            await productsAPI.getProducts({
                pageParam: 2,
                pageSize: 20,
            });

            expect(apiClient.get).toHaveBeenCalledWith(
                '/products',
                {
                    page: 2,
                    limit: 20,
                },
                expect.any(Object)
            );
        });

        it('returns paginated products response', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockPaginatedResponse);

            const result = await productsAPI.getProducts({});

            expect(result).toEqual(mockPaginatedResponse);
        });

        it('throws translated error when API call fails', async () => {
            vi.mocked(apiClient.get).mockRejectedValue(
                new Error('Network error')
            );

            await expect(productsAPI.getProducts({})).rejects.toThrow(
                'Ürünler alınamadı. Lütfen tekrar deneyin.'
            );
        });

        it('handles edge case parameters', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockPaginatedResponse);

            await productsAPI.getProducts({
                pageParam: 0,
                pageSize: 1,
            });

            expect(apiClient.get).toHaveBeenCalledWith(
                '/products',
                {
                    page: 0,
                    limit: 1,
                },
                expect.any(Object)
            );
        });

        it('handles large page parameters', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockPaginatedResponse);

            await productsAPI.getProducts({
                pageParam: 999,
                pageSize: 100,
            });

            expect(apiClient.get).toHaveBeenCalledWith(
                '/products',
                {
                    page: 999,
                    limit: 100,
                },
                expect.any(Object)
            );
        });
    });

    describe('getProductDetail', () => {
        const mockDetailedProduct: DetailedProduct = {
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

        it('calls API with correct slug parameter', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockDetailedProduct);

            await productsAPI.getProductDetail('test-product-slug');

            expect(apiClient.get).toHaveBeenCalledWith(
                '/products/test-product-slug',
                {},
                expect.any(Object) // schema
            );
        });

        it('returns detailed product data', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockDetailedProduct);

            const result =
                await productsAPI.getProductDetail('detailed-product');

            expect(result).toEqual(mockDetailedProduct);
        });

        it('throws translated error when API call fails', async () => {
            vi.mocked(apiClient.get).mockRejectedValue(new Error('Not found'));

            await expect(
                productsAPI.getProductDetail('non-existent-product')
            ).rejects.toThrow(
                'Ürün detayları alınamadı. Lütfen tekrar deneyin.'
            );
        });

        it('handles special characters in slug', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockDetailedProduct);

            const specialSlug = 'product-with-special-chars-üöç';
            await productsAPI.getProductDetail(specialSlug);

            expect(apiClient.get).toHaveBeenCalledWith(
                `/products/${specialSlug}`,
                {},
                expect.any(Object)
            );
        });

        it('handles empty slug gracefully', async () => {
            vi.mocked(apiClient.get).mockRejectedValue(
                new Error('Invalid slug')
            );

            await expect(productsAPI.getProductDetail('')).rejects.toThrow(
                'Ürün detayları alınamadı. Lütfen tekrar deneyin.'
            );
        });

        it('handles very long slugs', async () => {
            vi.mocked(apiClient.get).mockResolvedValue(mockDetailedProduct);

            const longSlug = 'a'.repeat(200);
            await productsAPI.getProductDetail(longSlug);

            expect(apiClient.get).toHaveBeenCalledWith(
                `/products/${longSlug}`,
                {},
                expect.any(Object)
            );
        });
    });

    describe('Error Handling', () => {
        it('preserves original error context while throwing translated message', async () => {
            const originalError = new Error('Network timeout');
            vi.mocked(apiClient.get).mockRejectedValue(originalError);

            try {
                await productsAPI.getProducts({});
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe(
                    'Ürünler alınamadı. Lütfen tekrar deneyin.'
                );
            }
        });

        it('handles different types of API errors consistently', async () => {
            const errorTypes = [
                new Error('Network error'),
                new TypeError('Type error'),
                new ReferenceError('Reference error'),
                'String error',
                null,
                undefined,
            ];

            for (const errorType of errorTypes) {
                vi.mocked(apiClient.get).mockRejectedValue(errorType);

                await expect(productsAPI.getProducts({})).rejects.toThrow(
                    'Ürünler alınamadı. Lütfen tekrar deneyin.'
                );
            }
        });
    });
});

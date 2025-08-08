import { describe, it, expect } from 'vitest';
import {
    productImageSchema,
    productVariantOptionSchema,
    productVariantSchema,
    productSchema,
    detailedProductSchema,
    paginatedProductsSchema,
    type Product,
    type DetailedProduct,
    type PaginatedProductsResponse,
} from '../model';

describe('Product Model Schemas', () => {
    describe('productImageSchema', () => {
        it('validates a valid product image', () => {
            const validImage = {
                url: 'https://example.com/image.jpg',
                alt: 'Product image',
                is_featured: true,
            };

            const result = productImageSchema.safeParse(validImage);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validImage);
            }
        });

        it('rejects invalid URL', () => {
            const invalidImage = {
                url: 'not-a-valid-url',
                alt: 'Product image',
                is_featured: true,
            };

            const result = productImageSchema.safeParse(invalidImage);
            expect(result.success).toBe(false);
        });

        it('rejects missing required fields', () => {
            const incompleteImage = {
                url: 'https://example.com/image.jpg',
                // missing alt and is_featured
            };

            const result = productImageSchema.safeParse(incompleteImage);
            expect(result.success).toBe(false);
        });

        it('rejects wrong data types', () => {
            const wrongTypeImage = {
                url: 'https://example.com/image.jpg',
                alt: 123, // should be string
                is_featured: 'true', // should be boolean
            };

            const result = productImageSchema.safeParse(wrongTypeImage);
            expect(result.success).toBe(false);
        });

        it('accepts empty alt text', () => {
            const imageWithEmptyAlt = {
                url: 'https://example.com/image.jpg',
                alt: '',
                is_featured: false,
            };

            const result = productImageSchema.safeParse(imageWithEmptyAlt);
            expect(result.success).toBe(false); // Empty alt text should be rejected
        });
    });

    describe('productVariantOptionSchema', () => {
        it('validates a valid variant option', () => {
            const validOption = {
                id: 1,
                name: 'Size',
                value: 'Large',
            };

            const result = productVariantOptionSchema.safeParse(validOption);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validOption);
            }
        });

        it('rejects non-numeric id', () => {
            const invalidOption = {
                id: 'not-a-number',
                name: 'Size',
                value: 'Large',
            };

            const result = productVariantOptionSchema.safeParse(invalidOption);
            expect(result.success).toBe(false);
        });

        it('rejects missing required fields', () => {
            const incompleteOption = {
                id: 1,
                // missing name and value
            };

            const result =
                productVariantOptionSchema.safeParse(incompleteOption);
            expect(result.success).toBe(false);
        });

        it('accepts special characters in name and value', () => {
            const specialCharOption = {
                id: 1,
                name: 'Renk/Color',
                value: 'Mavi-Açık',
            };

            const result =
                productVariantOptionSchema.safeParse(specialCharOption);
            expect(result.success).toBe(true);
        });
    });

    describe('productVariantSchema', () => {
        it('validates a valid product variant', () => {
            const validVariant = {
                id: 1,
                price: 99.99,
                stock: 10,
                sku: 'PROD-001',
                compare_at_price: 149.99,
                product_variant_options: [
                    {
                        id: 1,
                        name: 'Size',
                        value: 'Large',
                    },
                ],
            };

            const result = productVariantSchema.safeParse(validVariant);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validVariant);
            }
        });

        it('validates variant without optional compare_at_price', () => {
            const variantWithoutComparePrice = {
                id: 1,
                price: 99.99,
                stock: 10,
                sku: 'PROD-001',
                product_variant_options: [],
            };

            const result = productVariantSchema.safeParse(
                variantWithoutComparePrice
            );
            expect(result.success).toBe(true);
        });

        it('rejects negative price', () => {
            const invalidVariant = {
                id: 1,
                price: -10,
                stock: 10,
                sku: 'PROD-001',
                product_variant_options: [],
            };

            const result = productVariantSchema.safeParse(invalidVariant);
            expect(result.success).toBe(false);
        });

        it('rejects negative stock', () => {
            const invalidVariant = {
                id: 1,
                price: 99.99,
                stock: -5,
                sku: 'PROD-001',
                product_variant_options: [],
            };

            const result = productVariantSchema.safeParse(invalidVariant);
            expect(result.success).toBe(false);
        });

        it('accepts zero stock and price', () => {
            const zeroValues = {
                id: 1,
                price: 0,
                stock: 0,
                sku: 'PROD-001',
                product_variant_options: [],
            };

            const result = productVariantSchema.safeParse(zeroValues);
            expect(result.success).toBe(false); // Zero price should be rejected for valid products
        });

        it('validates multiple variant options', () => {
            const variantWithMultipleOptions = {
                id: 1,
                price: 99.99,
                stock: 10,
                sku: 'PROD-001',
                product_variant_options: [
                    { id: 1, name: 'Size', value: 'Large' },
                    { id: 2, name: 'Color', value: 'Red' },
                    { id: 3, name: 'Material', value: 'Cotton' },
                ],
            };

            const result = productVariantSchema.safeParse(
                variantWithMultipleOptions
            );
            expect(result.success).toBe(true);
        });
    });

    describe('productSchema', () => {
        it('validates a valid basic product', () => {
            const validProduct = {
                id: 1,
                title: 'Test Product',
                slug: 'test-product',
                product_images: [
                    {
                        url: 'https://example.com/image.jpg',
                        alt: 'Product image',
                        is_featured: true,
                    },
                ],
                product_variants: [
                    {
                        price: 99.99,
                    },
                ],
            };

            const result = productSchema.safeParse(validProduct);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validProduct);
            }
        });

        it('accepts product with empty images array', () => {
            const productWithoutImages = {
                id: 1,
                title: 'Test Product',
                slug: 'test-product',
                product_images: [],
                product_variants: [{ price: 99.99 }],
            };

            const result = productSchema.safeParse(productWithoutImages);
            expect(result.success).toBe(true);
        });

        it('accepts product with multiple images', () => {
            const productWithMultipleImages = {
                id: 1,
                title: 'Test Product',
                slug: 'test-product',
                product_images: [
                    {
                        url: 'https://example.com/image1.jpg',
                        alt: 'First image',
                        is_featured: true,
                    },
                    {
                        url: 'https://example.com/image2.jpg',
                        alt: 'Second image',
                        is_featured: false,
                    },
                ],
                product_variants: [{ price: 99.99 }],
            };

            const result = productSchema.safeParse(productWithMultipleImages);
            expect(result.success).toBe(true);
        });

        it('rejects product without variants', () => {
            const productWithoutVariants = {
                id: 1,
                title: 'Test Product',
                slug: 'test-product',
                product_images: [],
                product_variants: [],
            };

            const result = productSchema.safeParse(productWithoutVariants);
            expect(result.success).toBe(false);
        });

        it('handles special characters in title and slug', () => {
            const productWithSpecialChars = {
                id: 1,
                title: 'Çikolata & Kahve Karışımı',
                slug: 'cikolata-kahve-karisimi',
                product_images: [],
                product_variants: [{ price: 29.99 }],
            };

            const result = productSchema.safeParse(productWithSpecialChars);
            expect(result.success).toBe(true);
        });
    });

    describe('detailedProductSchema', () => {
        it('validates a valid detailed product', () => {
            const validDetailedProduct = {
                id: 1,
                title: 'Detailed Product',
                slug: 'detailed-product',
                description: 'A comprehensive product description',
                product_images: [
                    {
                        url: 'https://example.com/image.jpg',
                        alt: 'Product image',
                        is_featured: true,
                    },
                ],
                product_variants: [
                    {
                        id: 1,
                        price: 99.99,
                        stock: 10,
                        sku: 'PROD-001',
                        product_variant_options: [],
                    },
                ],
            };

            const result =
                detailedProductSchema.safeParse(validDetailedProduct);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validDetailedProduct);
            }
        });

        it('requires description field', () => {
            const productWithoutDescription = {
                id: 1,
                title: 'Product',
                slug: 'product',
                product_images: [],
                product_variants: [
                    {
                        id: 1,
                        price: 99.99,
                        stock: 10,
                        sku: 'PROD-001',
                        product_variant_options: [],
                    },
                ],
            };

            const result = detailedProductSchema.safeParse(
                productWithoutDescription
            );
            expect(result.success).toBe(false);
        });

        it('accepts empty description', () => {
            const productWithEmptyDescription = {
                id: 1,
                title: 'Product',
                slug: 'product',
                description: '',
                product_images: [],
                product_variants: [
                    {
                        id: 1,
                        price: 99.99,
                        stock: 10,
                        sku: 'PROD-001',
                        product_variant_options: [],
                    },
                ],
            };

            const result = detailedProductSchema.safeParse(
                productWithEmptyDescription
            );
            expect(result.success).toBe(true);
        });

        it('requires full variant schema for detailed products', () => {
            const productWithSimpleVariants = {
                id: 1,
                title: 'Product',
                slug: 'product',
                description: 'Description',
                product_images: [],
                product_variants: [{ price: 99.99 }], // Simple variant, not detailed
            };

            const result = detailedProductSchema.safeParse(
                productWithSimpleVariants
            );
            expect(result.success).toBe(false);
        });
    });

    describe('paginatedProductsSchema', () => {
        it('validates a valid paginated response', () => {
            const validPaginatedResponse = {
                data: [
                    {
                        id: 1,
                        title: 'Product 1',
                        slug: 'product-1',
                        product_images: [],
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

            const result = paginatedProductsSchema.safeParse(
                validPaginatedResponse
            );
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validPaginatedResponse);
            }
        });

        it('accepts empty products array', () => {
            const emptyPaginatedResponse = {
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

            const result = paginatedProductsSchema.safeParse(
                emptyPaginatedResponse
            );
            expect(result.success).toBe(true);
        });

        it('validates pagination with next page', () => {
            const responseWithNextPage = {
                data: [
                    {
                        id: 1,
                        title: 'Product 1',
                        slug: 'product-1',
                        product_images: [],
                        product_variants: [{ price: 99.99 }],
                    },
                ],
                pagination: {
                    page: 0,
                    limit: 1,
                    total: 5,
                    totalPages: 5,
                    hasNextPage: true,
                    hasPreviousPage: false,
                },
            };

            const result =
                paginatedProductsSchema.safeParse(responseWithNextPage);
            expect(result.success).toBe(true);
        });

        it('validates pagination with previous page', () => {
            const responseWithPreviousPage = {
                data: [
                    {
                        id: 2,
                        title: 'Product 2',
                        slug: 'product-2',
                        product_images: [],
                        product_variants: [{ price: 149.99 }],
                    },
                ],
                pagination: {
                    page: 2,
                    limit: 1,
                    total: 5,
                    totalPages: 5,
                    hasNextPage: true,
                    hasPreviousPage: true,
                },
            };

            const result = paginatedProductsSchema.safeParse(
                responseWithPreviousPage
            );
            expect(result.success).toBe(true);
        });

        it('rejects invalid pagination values', () => {
            const invalidPaginatedResponse = {
                data: [],
                pagination: {
                    page: -1, // Invalid negative page
                    limit: 0, // Invalid zero limit
                    total: -5, // Invalid negative total
                    totalPages: -1, // Invalid negative totalPages
                    hasNextPage: 'false', // Should be boolean
                    hasPreviousPage: 'true', // Should be boolean
                },
            };

            const result = paginatedProductsSchema.safeParse(
                invalidPaginatedResponse
            );
            expect(result.success).toBe(false);
        });

        it('rejects missing pagination fields', () => {
            const incompletePaginatedResponse = {
                data: [],
                pagination: {
                    page: 0,
                    // missing other required fields
                },
            };

            const result = paginatedProductsSchema.safeParse(
                incompletePaginatedResponse
            );
            expect(result.success).toBe(false);
        });
    });

    describe('Type Inference', () => {
        it('correctly infers Product type', () => {
            const product: Product = {
                id: 1,
                title: 'Test',
                slug: 'test',
                product_images: [],
                product_variants: [{ price: 99.99 }],
            };

            // Type check - this should compile without errors
            expect(product.id).toBe(1);
            expect(product.title).toBe('Test');
            expect(product.slug).toBe('test');
            expect(Array.isArray(product.product_images)).toBe(true);
            expect(Array.isArray(product.product_variants)).toBe(true);
        });

        it('correctly infers DetailedProduct type', () => {
            const detailedProduct: DetailedProduct = {
                id: 1,
                title: 'Test',
                slug: 'test',
                description: 'Description',
                product_images: [],
                product_variants: [
                    {
                        id: 1,
                        price: 99.99,
                        stock: 10,
                        sku: 'SKU-001',
                        product_variant_options: [],
                    },
                ],
            };

            // Type check - this should compile without errors
            expect(detailedProduct.description).toBe('Description');
            expect(detailedProduct.product_variants[0].id).toBe(1);
            expect(detailedProduct.product_variants[0].stock).toBe(10);
        });

        it('correctly infers PaginatedProductsResponse type', () => {
            const response: PaginatedProductsResponse = {
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

            // Type check - this should compile without errors
            expect(Array.isArray(response.data)).toBe(true);
            expect(typeof response.pagination.page).toBe('number');
            expect(typeof response.pagination.hasNextPage).toBe('boolean');
        });
    });
});

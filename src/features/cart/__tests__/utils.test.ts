import { describe, it, expect } from 'vitest';
import {
    formatPrice,
    calculateCartTotals,
    getFeaturedImage,
    CART_CONSTANTS,
} from '../lib/utils';
import type { CartItem } from '../model';

describe('Cart Utils', () => {
    describe('formatPrice', () => {
        it('formats Turkish Lira correctly', () => {
            expect(formatPrice(100)).toBe('₺100,00');
            expect(formatPrice(1234.56)).toBe('₺1.234,56');
            expect(formatPrice(0)).toBe('₺0,00');
        });

        it('handles decimal numbers', () => {
            expect(formatPrice(99.99)).toBe('₺99,99');
            expect(formatPrice(15.5)).toBe('₺15,50');
            expect(formatPrice(20.123)).toBe('₺20,12');
        });

        it('handles large numbers', () => {
            expect(formatPrice(1000000)).toBe('₺1.000.000,00');
            expect(formatPrice(123456789.99)).toBe('₺123.456.789,99');
        });

        it('handles negative numbers', () => {
            expect(formatPrice(-100)).toBe('-₺100,00');
            expect(formatPrice(-1234.56)).toBe('-₺1.234,56');
        });
    });

    describe('calculateCartTotals', () => {
        const mockCartItems: CartItem[] = [
            {
                id: 1,
                quantity: 2,
                unit_price: 100,
                variants: {
                    id: 1,
                    sku: 'SKU-1',
                    price: 100,
                    product: {
                        id: 1,
                        title: 'Product 1',
                        slug: 'product-1',
                        product_images: [],
                    },
                    variant_options: [],
                },
            },
            {
                id: 2,
                quantity: 1,
                unit_price: 50,
                variants: {
                    id: 2,
                    sku: 'SKU-2',
                    price: 50,
                    product: {
                        id: 2,
                        title: 'Product 2',
                        slug: 'product-2',
                        product_images: [],
                    },
                    variant_options: [],
                },
            },
        ];

        it('calculates totals correctly for cart under free shipping threshold', () => {
            const totals = calculateCartTotals(mockCartItems);
            // Subtotal: (2 * 100) + (1 * 50) = 250
            // Shipping: 29.99 (under 500 threshold)
            // Tax: 250 * 0.18 = 45
            // Total: 250 + 29.99 + 45 = 324.99

            expect(totals.subtotal).toBe(250);
            expect(totals.shipping).toBe(29.99);
            expect(totals.tax).toBe(45);
            expect(totals.total).toBe(324.99);
        });

        it('calculates free shipping for cart over threshold', () => {
            const highValueItems: CartItem[] = [
                {
                    ...mockCartItems[0],
                    quantity: 6, // 6 * 100 = 600
                },
            ];

            const totals = calculateCartTotals(highValueItems);
            // Subtotal: 600
            // Shipping: 0 (over 500 threshold)
            // Tax: 600 * 0.18 = 108
            // Total: 600 + 0 + 108 = 708

            expect(totals.subtotal).toBe(600);
            expect(totals.shipping).toBe(0);
            expect(totals.tax).toBe(108);
            expect(totals.total).toBe(708);
        });

        it('handles empty cart', () => {
            const totals = calculateCartTotals([]);

            expect(totals.subtotal).toBe(0);
            expect(totals.shipping).toBe(29.99);
            expect(totals.tax).toBe(0);
            expect(totals.total).toBe(29.99);
        });

        it('calculates totals exactly at free shipping threshold', () => {
            const thresholdItems: CartItem[] = [
                {
                    ...mockCartItems[0],
                    quantity: 5, // 5 * 100 = 500
                },
            ];

            const totals = calculateCartTotals(thresholdItems);

            expect(totals.subtotal).toBe(500);
            expect(totals.shipping).toBe(29.99); // exactly at threshold, should still pay shipping
        });

        it('calculates totals just over free shipping threshold', () => {
            const overThresholdItems: CartItem[] = [
                {
                    ...mockCartItems[0],
                    quantity: 5, // 5 * 100 = 500
                    unit_price: 100.01, // 5 * 100.01 = 500.05
                },
            ];

            const totals = calculateCartTotals(overThresholdItems);

            expect(totals.subtotal).toBe(500.05);
            expect(totals.shipping).toBe(0); // over threshold, free shipping
        });

        it('handles decimal quantities and prices', () => {
            const decimalItems: CartItem[] = [
                {
                    ...mockCartItems[0],
                    quantity: 3,
                    unit_price: 33.33,
                },
            ];

            const totals = calculateCartTotals(decimalItems);
            const expectedSubtotal = 3 * 33.33; // 99.99

            expect(totals.subtotal).toBe(expectedSubtotal);
            expect(totals.tax).toBe(expectedSubtotal * 0.18);
        });
    });

    describe('getFeaturedImage', () => {
        const mockCartItem: CartItem = {
            id: 1,
            quantity: 1,
            unit_price: 100,
            variants: {
                id: 1,
                sku: 'SKU-1',
                price: 100,
                product: {
                    id: 1,
                    title: 'Product 1',
                    slug: 'product-1',
                    product_images: [
                        {
                            url: 'https://example.com/image1.jpg',
                            alt: 'Image 1',
                            is_featured: false,
                        },
                        {
                            url: 'https://example.com/featured.jpg',
                            alt: 'Featured Image',
                            is_featured: true,
                        },
                        {
                            url: 'https://example.com/image2.jpg',
                            alt: 'Image 2',
                            is_featured: false,
                        },
                    ],
                },
                variant_options: [],
            },
        };

        it('returns featured image when available', () => {
            const featuredImage = getFeaturedImage(mockCartItem);

            expect(featuredImage).toBeDefined();
            expect(featuredImage?.is_featured).toBe(true);
            expect(featuredImage?.url).toBe('https://example.com/featured.jpg');
            expect(featuredImage?.alt).toBe('Featured Image');
        });

        it('returns first image when no featured image', () => {
            const itemWithoutFeatured = {
                ...mockCartItem,
                variants: {
                    ...mockCartItem.variants,
                    product: {
                        ...mockCartItem.variants.product,
                        product_images:
                            mockCartItem.variants.product.product_images.map(
                                img => ({
                                    ...img,
                                    is_featured: false,
                                })
                            ),
                    },
                },
            };

            const featuredImage = getFeaturedImage(itemWithoutFeatured);

            expect(featuredImage).toBeDefined();
            expect(featuredImage?.url).toBe('https://example.com/image1.jpg');
            expect(featuredImage?.alt).toBe('Image 1');
        });

        it('returns undefined when no images available', () => {
            const itemWithoutImages = {
                ...mockCartItem,
                variants: {
                    ...mockCartItem.variants,
                    product: {
                        ...mockCartItem.variants.product,
                        product_images: [],
                    },
                },
            };

            const featuredImage = getFeaturedImage(itemWithoutImages);

            expect(featuredImage).toBeUndefined();
        });
    });

    describe('CART_CONSTANTS', () => {
        it('exports correct constants', () => {
            expect(CART_CONSTANTS.FREE_SHIPPING_THRESHOLD).toBe(500);
            expect(CART_CONSTANTS.TAX_RATE).toBe(0.18);
            expect(CART_CONSTANTS.DEFAULT_SHIPPING_COST).toBe(29.99);
        });

        it('constants have expected values and types', () => {
            expect(CART_CONSTANTS.FREE_SHIPPING_THRESHOLD).toBe(500);
            expect(CART_CONSTANTS.TAX_RATE).toBe(0.18);
            expect(CART_CONSTANTS.DEFAULT_SHIPPING_COST).toBe(29.99);

            expect(typeof CART_CONSTANTS.FREE_SHIPPING_THRESHOLD).toBe(
                'number'
            );
            expect(typeof CART_CONSTANTS.TAX_RATE).toBe('number');
            expect(typeof CART_CONSTANTS.DEFAULT_SHIPPING_COST).toBe('number');
        });
    });
});

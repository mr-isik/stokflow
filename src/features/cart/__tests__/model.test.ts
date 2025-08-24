import { describe, it, expect } from 'vitest';
import {
    cartItemVariantSchema,
    cartItemSchema,
    cartResponseSchema,
    type CartItem,
    type Cart,
    type CartResponse,
} from '../model';

describe('Cart Model Schemas', () => {
    describe('cartItemVariantSchema', () => {
        it('validates a valid cart item variant', () => {
            const validVariant = {
                id: 1,
                sku: 'SKU-123',
                price: 99.99,
                product: {
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
                },
                variant_options: [
                    {
                        name: 'Color',
                        value: 'Red',
                    },
                ],
            };

            const result = cartItemVariantSchema.safeParse(validVariant);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validVariant);
            }
        });

        it('rejects negative price', () => {
            const invalidVariant = {
                id: 1,
                sku: 'SKU-123',
                price: -10,
                product: {
                    id: 1,
                    title: 'Test Product',
                    slug: 'test-product',
                    product_images: [],
                },
                variant_options: [],
            };

            const result = cartItemVariantSchema.safeParse(invalidVariant);
            expect(result.success).toBe(false);
        });

        it('uses default price of 0 when not provided', () => {
            const variantWithoutPrice = {
                id: 1,
                sku: 'SKU-123',
                product: {
                    id: 1,
                    title: 'Test Product',
                    slug: 'test-product',
                    product_images: [],
                },
                variant_options: [],
            };

            const result = cartItemVariantSchema.safeParse(variantWithoutPrice);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.price).toBe(0);
            }
        });

        it('rejects missing required fields', () => {
            const incompleteVariant = {
                id: 1,
                // missing sku, product, variant_options
            };

            const result = cartItemVariantSchema.safeParse(incompleteVariant);
            expect(result.success).toBe(false);
        });
    });

    describe('cartItemSchema', () => {
        const validVariant = {
            id: 1,
            sku: 'SKU-123',
            price: 99.99,
            product: {
                id: 1,
                title: 'Test Product',
                slug: 'test-product',
                product_images: [],
            },
            variant_options: [],
        };

        it('validates a valid cart item', () => {
            const validCartItem = {
                id: 1,
                quantity: 2,
                unit_price: 99.99,
                variants: validVariant,
            };

            const result = cartItemSchema.safeParse(validCartItem);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validCartItem);
            }
        });

        it('rejects quantity less than 1', () => {
            const invalidCartItem = {
                id: 1,
                quantity: 0,
                unit_price: 99.99,
                variants: validVariant,
            };

            const result = cartItemSchema.safeParse(invalidCartItem);
            expect(result.success).toBe(false);
        });

        it('rejects negative unit_price', () => {
            const invalidCartItem = {
                id: 1,
                quantity: 2,
                unit_price: -10,
                variants: validVariant,
            };

            const result = cartItemSchema.safeParse(invalidCartItem);
            expect(result.success).toBe(false);
        });

        it('uses default values when not provided', () => {
            const cartItemWithDefaults = {
                id: 1,
                variants: validVariant,
            };

            const result = cartItemSchema.safeParse(cartItemWithDefaults);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.quantity).toBe(1);
                expect(result.data.unit_price).toBe(0);
            }
        });
    });

    describe('cartResponseSchema', () => {
        const validCartItem = {
            id: 1,
            quantity: 2,
            unit_price: 99.99,
            variants: {
                id: 1,
                sku: 'SKU-123',
                price: 99.99,
                product: {
                    id: 1,
                    title: 'Test Product',
                    slug: 'test-product',
                    product_images: [],
                },
                variant_options: [],
            },
        };

        it('validates a valid cart response', () => {
            const validCartResponse = {
                id: 1,
                items: [validCartItem],
            };

            const result = cartResponseSchema.safeParse(validCartResponse);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validCartResponse);
            }
        });

        it('validates empty cart', () => {
            const emptyCart = {
                id: 1,
                items: [],
            };

            const result = cartResponseSchema.safeParse(emptyCart);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.items).toHaveLength(0);
            }
        });

        it('validates cart with multiple items', () => {
            const cartWithMultipleItems = {
                id: 1,
                items: [validCartItem, { ...validCartItem, id: 2 }],
            };

            const result = cartResponseSchema.safeParse(cartWithMultipleItems);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.items).toHaveLength(2);
            }
        });

        it('rejects missing required fields', () => {
            const incompleteCart = {
                id: 1,
                // missing items
            };

            const result = cartResponseSchema.safeParse(incompleteCart);
            expect(result.success).toBe(false);
        });
    });

    describe('Type exports', () => {
        it('exports CartItem type', () => {
            const cartItem: CartItem = {
                id: 1,
                quantity: 2,
                unit_price: 99.99,
                variants: {
                    id: 1,
                    sku: 'SKU-123',
                    price: 99.99,
                    product: {
                        id: 1,
                        title: 'Test Product',
                        slug: 'test-product',
                        product_images: [],
                    },
                    variant_options: [],
                },
            };

            expect(cartItem).toBeDefined();
            expect(cartItem.id).toBe(1);
            expect(cartItem.quantity).toBe(2);
        });

        it('exports Cart and CartResponse types', () => {
            const cart: Cart = {
                id: 1,
                items: [],
            };

            const cartResponse: CartResponse = {
                id: 1,
                items: [],
            };

            expect(cart).toBeDefined();
            expect(cartResponse).toBeDefined();
            expect(cart.id).toBe(cartResponse.id);
        });
    });
});

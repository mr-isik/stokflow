/**
 * Cart utilities and helper functions
 * Shared between cart page and cart sheet components
 */

import { CartItem } from '@/features/cart/model';

/**
 * Format price to Turkish Lira currency format
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(price);
};

/**
 * Calculate cart totals
 */
export interface CartTotals {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export const calculateCartTotals = (items: CartItem[]): CartTotals => {
    const subtotal = items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
    );

    const shipping = subtotal > 500 ? 0 : 29.99;
    const tax = subtotal * 0.18; // %18 KDV
    const total = subtotal + shipping + tax;

    return {
        subtotal,
        shipping,
        tax,
        total,
    };
};

/**
 * Get featured image from cart item
 */
export const getFeaturedImage = (item: CartItem) => {
    return (
        item.variants.product.product_images.find(img => img.is_featured) ||
        item.variants.product.product_images[0]
    );
};

/**
 * Constants for cart business logic
 */
export const CART_CONSTANTS = {
    FREE_SHIPPING_THRESHOLD: 500,
    TAX_RATE: 0.18,
    DEFAULT_SHIPPING_COST: 29.99,
} as const;

import type { CartItem, Cart } from '../model';
import { vi } from 'vitest';

/**
 * Mock test data for cart functionality
 */

// Mock Product Images
export const mockProductImages = [
    {
        url: 'https://example.com/image1.jpg',
        alt: 'Product Image 1',
        is_featured: false,
    },
    {
        url: 'https://example.com/featured.jpg',
        alt: 'Featured Product Image',
        is_featured: true,
    },
    {
        url: 'https://example.com/image2.jpg',
        alt: 'Product Image 2',
        is_featured: false,
    },
];

// Mock Variant Options
export const mockVariantOptions = [
    {
        name: 'Renk',
        value: 'Kırmızı',
    },
    {
        name: 'Beden',
        value: 'M',
    },
];

// Mock Cart Items
export const mockCartItems: CartItem[] = [
    {
        id: 1,
        quantity: 2,
        unit_price: 100,
        variants: {
            id: 1,
            sku: 'SKU-001',
            price: 100,
            product: {
                id: 1,
                title: 'Test Ürün 1',
                slug: 'test-urun-1',
                product_images: mockProductImages,
            },
            variant_options: mockVariantOptions,
        },
    },
    {
        id: 2,
        quantity: 1,
        unit_price: 250,
        variants: {
            id: 2,
            sku: 'SKU-002',
            price: 250,
            product: {
                id: 2,
                title: 'Test Ürün 2',
                slug: 'test-urun-2',
                product_images: [mockProductImages[0]],
            },
            variant_options: [mockVariantOptions[0]],
        },
    },
    {
        id: 3,
        quantity: 3,
        unit_price: 75,
        variants: {
            id: 3,
            sku: 'SKU-003',
            price: 75,
            product: {
                id: 3,
                title: 'Test Ürün 3',
                slug: 'test-urun-3',
                product_images: [],
            },
            variant_options: [],
        },
    },
];

// Mock Cart Data
export const mockCart: Cart = {
    id: 1,
    items: mockCartItems,
};

// Empty Cart
export const mockEmptyCart: Cart = {
    id: 1,
    items: [],
};

// Single Item Cart
export const mockSingleItemCart: Cart = {
    id: 1,
    items: [mockCartItems[0]],
};

// High Value Cart (for free shipping)
export const mockHighValueCart: Cart = {
    id: 1,
    items: [
        {
            ...mockCartItems[0],
            quantity: 6,
            unit_price: 100,
        },
    ],
};

// Test User Data
export const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {
        name: 'Test User',
    },
};

// Mock Auth States
export const mockAuthStates = {
    authenticated: {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    },
    unauthenticated: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    },
    loading: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    },
};

// Test Error Objects
export const mockErrors = {
    networkError: {
        message: 'Network Error',
        code: 'NETWORK_ERROR',
    },
    validationError: {
        message: 'Validation Error',
        code: 'VALIDATION_ERROR',
    },
    authError: {
        message: 'Authentication Error',
        code: 'AUTH_ERROR',
    },
};

// Mock API Responses
export const mockApiResponses = {
    success: { success: true },
    cartUpdate: mockCartItems[0],
    cartRemove: { success: true, message: 'Item removed' },
};

// Test Constants
export const testConstants = {
    LOADING_TIMEOUT: 1000,
    ANIMATION_DELAY: 100,
    DEFAULT_QUANTITY: 1,
    MAX_QUANTITY: 99,
    MIN_QUANTITY: 1,
};

// Helper Functions for Tests
export const createMockCartItem = (
    overrides: Partial<CartItem> = {}
): CartItem => ({
    ...mockCartItems[0],
    ...overrides,
});

export const createMockCart = (items: CartItem[] = mockCartItems): Cart => ({
    id: 1,
    items,
});

// Export vi for tests that import this file
export { vi } from 'vitest';

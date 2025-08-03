import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { vi } from 'vitest';
import type { Product, PaginatedProductsResponse } from '../model';

// Mock Product Data
export const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    slug: 'test-product',
    description: 'This is a test product description for testing purposes.',
    brand: 'Test Brand',
    category: 'Test Category',
    features: [
        'High quality materials',
        'Durable construction',
        'Modern design',
        'Easy to use',
    ],
    product_images: [
        {
            url: 'https://example.com/image1.jpg',
            alt: 'Test Product Image',
            is_featured: true,
        },
        {
            url: 'https://example.com/image2.jpg',
            alt: 'Test Product Image 2',
            is_featured: false,
        },
    ],
    product_variants: [
        {
            id: 1,
            price: 99.99,
            size: 'M',
            color: 'Red',
            stock: 10,
            sku: 'TP-RED-M',
        },
    ],
    reviews: [
        {
            id: 1,
            user_name: 'Test User',
            rating: 5,
            comment: 'Great product!',
            created_at: '2024-01-01T00:00:00Z',
            helpful_count: 5,
        },
    ],
    average_rating: 4.5,
    total_reviews: 1,
};

export const mockProductWithoutImage: Product = {
    id: 2,
    title: 'Product Without Image',
    slug: 'product-without-image',
    description: 'A test product without any images.',
    brand: 'Test Brand',
    category: 'Test Category',
    features: ['Basic features'],
    product_images: [],
    product_variants: [
        {
            id: 2,
            price: 149.99,
            stock: 5,
            sku: 'PWI-001',
        },
    ],
    reviews: [],
    average_rating: 0,
    total_reviews: 0,
};

export const mockProducts: Product[] = [
    mockProduct,
    {
        id: 2,
        title: 'Second Product',
        slug: 'second-product',
        description: 'This is the second test product.',
        brand: 'Second Brand',
        category: 'Second Category',
        features: ['Feature A', 'Feature B'],
        product_images: [
            {
                url: 'https://example.com/image3.jpg',
                alt: 'Second Product Image',
                is_featured: true,
            },
        ],
        product_variants: [
            {
                id: 3,
                price: 199.99,
                stock: 15,
                sku: 'SP-001',
            },
        ],
        reviews: [],
        average_rating: 0,
        total_reviews: 0,
    },
    {
        id: 3,
        title: 'Third Product',
        slug: 'third-product',
        description: 'This is the third test product.',
        brand: 'Third Brand',
        category: 'Third Category',
        features: ['Premium quality', 'Long lasting'],
        product_images: [
            {
                url: 'https://example.com/image4.jpg',
                alt: 'Third Product Image',
                is_featured: true,
            },
        ],
        product_variants: [
            {
                id: 4,
                price: 399.99,
                stock: 8,
                sku: 'TP-001',
            },
        ],
        reviews: [],
        average_rating: 0,
        total_reviews: 0,
    },
];

export const mockPaginatedResponse: PaginatedProductsResponse = {
    data: mockProducts,
    pagination: {
        page: 0,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    },
};

export const mockPaginatedResponseWithNextPage: PaginatedProductsResponse = {
    data: mockProducts.slice(0, 2),
    pagination: {
        page: 0,
        limit: 2,
        total: 10,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
    },
};

export const mockSecondPageResponse: PaginatedProductsResponse = {
    data: [mockProducts[2]],
    pagination: {
        page: 1,
        limit: 2,
        total: 10,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: true,
    },
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
    queryClient?: QueryClient;
}

export function renderWithProviders(
    ui: ReactElement,
    options: CustomRenderOptions = {}
) {
    const {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    gcTime: 0,
                },
            },
        }),
        ...renderOptions
    } = options;

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock IntersectionObserver for tests
interface MockObserver {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    callback?: IntersectionObserverCallback;
}

export const mockIntersectionObserver = (): MockObserver => {
    const mockObserver: MockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    };

    global.IntersectionObserver = vi
        .fn()
        .mockImplementation((callback: IntersectionObserverCallback) => {
            mockObserver.callback = callback;
            return mockObserver;
        });

    return mockObserver;
};

export const triggerIntersection = (
    observer: MockObserver,
    isIntersecting = true
) => {
    if (observer.callback) {
        observer.callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            observer as unknown as IntersectionObserver
        );
    }
};

export * from '@testing-library/react';
export { renderWithProviders as render };

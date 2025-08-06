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
            price: 99.99,
        },
    ],
};

export const mockProductWithoutImage: Product = {
    id: 2,
    title: 'Product Without Image',
    slug: 'product-without-image',
    product_images: [],
    product_variants: [
        {
            price: 149.99,
        },
    ],
};

export const mockProducts: Product[] = [
    mockProduct,
    {
        id: 2,
        title: 'Second Product',
        slug: 'second-product',
        product_images: [
            {
                url: 'https://example.com/image3.jpg',
                alt: 'Second Product Image',
                is_featured: true,
            },
        ],
        product_variants: [
            {
                price: 199.99,
            },
        ],
    },
    {
        id: 3,
        title: 'Third Product',
        slug: 'third-product',
        product_images: [
            {
                url: 'https://example.com/image4.jpg',
                alt: 'Third Product Image',
                is_featured: true,
            },
        ],
        product_variants: [
            {
                price: 399.99,
            },
        ],
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

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import { ProductsSkeleton } from './product-skeleton';
import type { Product, PaginatedProductsResponse } from '../model';
import { useInfiniteQueryProducts } from '../queries';
import { ProductCard } from './product-card';
import { useRouter } from 'next/navigation';

export function ProductList() {
    const observerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQueryProducts();

    const onProductClick = useCallback(
        (productId: number, slug: string) => {
            router.push(`/${slug}`);
            // Implement your navigation logic here
        },
        [router]
    );

    const onAddToCart = useCallback(async (productId: number) => {
        console.log('Adding to cart:', productId);
        // Implement your add to cart logic here
    }, []);

    useEffect(() => {
        const currentObserverRef = observerRef.current;

        const observer = new IntersectionObserver(
            entries => {
                const [entry] = entries;
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0,
                rootMargin: '100px',
            }
        );

        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleAddToCart = useCallback(
        async (productId: number) => {
            if (onAddToCart) {
                await onAddToCart(productId);
            }
        },
        [onAddToCart]
    );

    const handleProductClick = useCallback(
        (productId: number, slug: string) => {
            if (onProductClick) {
                onProductClick(productId, slug);
            }
        },
        [onProductClick]
    );

    // Loading state
    if (status === 'pending') {
        return <ProductsSkeleton count={20} />;
    }

    // Error state
    if (status === 'error' || error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-lg font-semibold text-danger mb-2">
                    Ürünler yüklenirken bir hata oluştu
                </div>
                <div className="text-sm text-foreground-500 mb-4">
                    {error?.message || 'Bilinmeyen bir hata oluştu'}
                </div>
                <Button
                    color="primary"
                    variant="flat"
                    onPress={() => window.location.reload()}
                >
                    Tekrar Dene
                </Button>
            </div>
        );
    }

    // Flatten all pages data - infinite query returns pages array
    const allProducts =
        data?.pages?.flatMap((page: PaginatedProductsResponse) => page.data) ||
        [];

    // Empty state
    if (allProducts.length === 0 && !isFetching) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-lg font-semibold text-foreground-700 mb-2">
                    Henüz ürün bulunamadı
                </div>
                <div className="text-sm text-foreground-500">
                    Yakında yeni ürünler eklenecek.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Products Grid */}

            {data.pages.map(
                (page: PaginatedProductsResponse, index: number) => (
                    <div
                        key={index}
                        className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {page.data.map((product: Product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                onProductClick={handleProductClick}
                            />
                        ))}
                    </div>
                )
            )}

            {/* Loading more indicator */}
            {isFetchingNextPage && (
                <div className="py-8">
                    <ProductsSkeleton count={10} />
                </div>
            )}

            {/* Load more button (fallback for intersection observer) */}
            {hasNextPage && !isFetchingNextPage && (
                <div className="flex justify-center py-8">
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={() => fetchNextPage()}
                        isLoading={isFetchingNextPage}
                    >
                        Daha Fazla Yükle
                    </Button>
                </div>
            )}

            {/* End of results */}
            {!hasNextPage && allProducts.length > 0 && (
                <div className="text-center py-8 text-foreground-500">
                    Tüm ürünler yüklendi
                </div>
            )}

            {/* Hidden element for intersection observer */}
            <div ref={observerRef} className="h-1" />
        </div>
    );
}

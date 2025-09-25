'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import type { PaginatedProductsResponse, Product } from '../model';
import { useInfiniteQueryProducts } from '../queries';
import { ProductCard } from './product-card';
import { ProductsSkeleton } from './product-skeleton';

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
    } = useInfiniteQueryProducts({});

    const onProductClick = useCallback(
        (slug: string) => {
            router.push(`/${slug}`);
        },
        [router]
    );

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

    const handleProductClick = useCallback(
        (slug: string) => {
            if (onProductClick) {
                onProductClick(slug);
            }
        },
        [onProductClick]
    );

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

    const allProducts =
        data?.pages?.flatMap(
            page => (page as PaginatedProductsResponse).data
        ) ?? [];

    if ((allProducts.length === 0 && !isFetching) || !allProducts) {
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

            {data?.pages?.map((page, index: number) => (
                <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                    {(page as PaginatedProductsResponse).data.map(
                        (product: Product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onProductClick={handleProductClick}
                            />
                        )
                    )}
                </div>
            ))}

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

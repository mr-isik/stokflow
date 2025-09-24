'use client';

import { useInfiniteQueryProducts } from '@/entities/product/queries';
import { ProductCard } from '@/entities/product/ui/product-card';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import { Button, Chip, Divider, Input, Slider, Spinner } from '@heroui/react';
import { SearchIcon } from '@heroui/shared-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface CategoryPageProps {
    params: {
        category: string;
    };
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100]);

    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    const [debouncedPriceRange] = useDebounce(priceRange, 300);

    const queryClient = useQueryClient();

    const categoryName = params.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQueryProducts({
        pageSize: 12,
        category: params.category,
        query: debouncedSearchQuery || undefined,
        priceRange:
            debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 100
                ? (debouncedPriceRange as [number, number])
                : undefined,
    });

    const isDebouncing =
        searchQuery !== debouncedSearchQuery ||
        JSON.stringify(priceRange) !== JSON.stringify(debouncedPriceRange);

    useEffect(() => {
        queryClient.resetQueries({ queryKey: ['products'] });
    }, [debouncedSearchQuery, debouncedPriceRange, queryClient]);

    const allProducts = useMemo(() => {
        return data?.pages.flatMap((page: any) => page.data) || [];
    }, [data]);

    const clearFilters = () => {
        setSearchQuery('');
        setPriceRange([0, 100]);
    };

    const handleProductClick = (slug: string) => {
        window.location.href = `/${slug}`;
    };

    return (
        <MaxWidthWrapper className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Filters */}
                <aside className="lg:w-80 space-y-6 sticky top-20 self-start">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-default-900">
                            Filtreler
                        </h3>
                        <Button
                            variant="light"
                            size="sm"
                            onClick={clearFilters}
                            className="text-primary"
                        >
                            Temizle
                        </Button>
                    </div>

                    {/* Search */}
                    <div>
                        <h4 className="font-semibold mb-3 text-default-800">
                            Ürün Ara
                        </h4>
                        <Input
                            placeholder="Ürün adı yazın..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            startContent={<SearchIcon className="w-4 h-4" />}
                            variant="bordered"
                            description={
                                searchQuery !== debouncedSearchQuery
                                    ? 'Arama yapılıyor...'
                                    : undefined
                            }
                        />
                    </div>

                    <Divider />

                    {/* Price Range */}
                    <div>
                        <h4 className="font-semibold mb-3 text-default-800">
                            Fiyat Aralığı
                        </h4>
                        <Slider
                            label={
                                JSON.stringify(priceRange) !==
                                JSON.stringify(debouncedPriceRange)
                                    ? 'Fiyat (₺) - Güncelleniyor...'
                                    : 'Fiyat (₺)'
                            }
                            step={5}
                            minValue={0}
                            maxValue={100}
                            value={priceRange}
                            onChange={value => setPriceRange(value as number[])}
                            className="max-w-md"
                            formatOptions={{
                                style: 'currency',
                                currency: 'TRY',
                            }}
                        />
                    </div>

                    <Divider />
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-default-900 mb-2">
                                {categoryName}
                            </h1>
                            {allProducts.length !== 0 &&
                                !isLoading &&
                                !error && (
                                    <p className="text-default-600">
                                        {allProducts.length} ürün bulundu
                                    </p>
                                )}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || isDebouncing) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {searchQuery && (
                                <Chip
                                    onClose={() => setSearchQuery('')}
                                    variant="flat"
                                    color={
                                        searchQuery !== debouncedSearchQuery
                                            ? 'warning'
                                            : 'primary'
                                    }
                                >
                                    Arama: {searchQuery}
                                    {searchQuery !== debouncedSearchQuery &&
                                        ' (yazılıyor...)'}
                                </Chip>
                            )}
                            {JSON.stringify(priceRange) !==
                                JSON.stringify(debouncedPriceRange) && (
                                <Chip variant="flat" color="warning">
                                    Fiyat güncelleniyor...
                                </Chip>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="text-center py-12">
                            <p className="text-lg text-danger mb-4">
                                Ürünler yüklenirken bir hata oluştu
                            </p>
                            <Button
                                variant="light"
                                color="primary"
                                onClick={() => window.location.reload()}
                            >
                                Tekrar Dene
                            </Button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!isLoading && !error && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onProductClick={handleProductClick}
                                    />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasNextPage && (
                                <div className="flex justify-center mt-8">
                                    <Button
                                        variant="bordered"
                                        color="primary"
                                        onClick={() => fetchNextPage()}
                                        isLoading={isFetchingNextPage}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage
                                            ? 'Yükleniyor...'
                                            : 'Daha Fazla Yükle'}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* No Results */}
                    {!isLoading && !error && allProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-lg text-default-500 mb-4">
                                Ürün bulunamadı
                            </p>
                            <Button
                                variant="light"
                                color="primary"
                                onClick={clearFilters}
                            >
                                Filtreleri Temizle
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </MaxWidthWrapper>
    );
}

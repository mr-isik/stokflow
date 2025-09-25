'use client';

import { useQuerySearchProducts } from '@/entities/product/queries';
import {
    Button,
    Card,
    CardBody,
    Divider,
    Image,
    Input,
    Spinner,
} from '@heroui/react';
import { CloseIcon, SearchIcon } from '@heroui/shared-icons';
import { QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
    className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const getPlaceholder = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            return 'Ürün ara...';
        }
        return 'Ürün, kategori veya marka ara...';
    };

    const queryClient = new QueryClient();
    const [debouncedSearchValue] = useDebounce(searchValue, 300);

    const {
        data: searchResults,
        isLoading,
        error,
    } = useQuerySearchProducts(debouncedSearchValue);

    useEffect(() => {
        queryClient.resetQueries({
            queryKey: ['searchProducts', debouncedSearchValue],
            exact: true,
            stale: true,
        });
    }, [debouncedSearchValue, queryClient]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(price);
    };

    return (
        <div className={`relative ${className}`}>
            <Input
                type="text"
                placeholder={getPlaceholder()}
                value={searchValue}
                onValueChange={setSearchValue}
                onFocus={() => setIsOpen(true)}
                startContent={
                    <SearchIcon className="text-default-400 w-5 h-5 flex-shrink-0" />
                }
                endContent={
                    searchValue && (
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => {
                                setSearchValue('');
                                setIsOpen(false);
                            }}
                            className="min-w-unit-6 w-6 h-6"
                        >
                            <CloseIcon className="w-4 h-4" />
                        </Button>
                    )
                }
                classNames={{
                    base: 'w-full',
                    inputWrapper:
                        'bg-default-50 border border-default-200 hover:border-default-300 focus-within:border-primary-400 focus-within:bg-white transition-all duration-200 min-h-unit-12',
                    input: 'text-small placeholder:text-default-400 min-w-0',
                }}
                size="lg"
            />

            {/* Search Results Dropdown */}
            {isOpen && searchValue && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto shadow-xl border border-default-200">
                    <CardBody className="p-0">
                        {searchResults && searchResults?.data?.length > 0 ? (
                            <>
                                <div className="p-3 text-small text-default-600 bg-gradient-to-r from-default-50 to-default-100">
                                    <span className="font-medium">
                                        {searchResults.data.length} sonuç
                                        bulundu
                                    </span>
                                    <span className="text-xs ml-2 text-default-500">
                                        "{searchValue}" için
                                    </span>
                                </div>
                                <Divider />
                                {searchResults.data.map((result, index) => (
                                    <div key={result.id}>
                                        <div
                                            className="flex items-center gap-3 p-3 hover:bg-default-50 cursor-pointer transition-colors duration-200"
                                            onClick={() => {
                                                router.push(`/${result.slug}`);
                                                setSearchValue('');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <Image
                                                src={
                                                    result.product_images[0]
                                                        ?.url
                                                }
                                                alt={result.title}
                                                className="w-12 h-12 object-cover ring-1 ring-default-200"
                                                radius="md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-small font-medium text-default-900 truncate">
                                                    {result.title}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-small font-semibold text-primary-600">
                                                    {formatPrice(
                                                        result
                                                            .product_variants[0]
                                                            .price
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        {index <
                                            searchResults.data.length - 1 && (
                                            <Divider />
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : !isLoading ? (
                            <div className="p-8 text-center text-default-500">
                                <SearchIcon className="mx-auto mb-3 w-8 h-8 text-default-300" />
                                <p className="text-small font-medium">
                                    Aradığınız ürün bulunamadı
                                </p>
                                <p className="text-tiny mt-1">
                                    Farklı anahtar kelimeler deneyin
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-default-500">
                                <Spinner />
                            </div>
                        )}

                        {error && (
                            <Card className="m-4 bg-red-50 border border-red-200">
                                <CardBody className="p-3 text-red-700 text-center text-small">
                                    Arama sonuçları alınamadı. Lütfen tekrar
                                    deneyin.
                                </CardBody>
                            </Card>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Backdrop - only show when search has results */}
            {isOpen &&
                searchValue &&
                searchResults &&
                searchResults.data.length > 0 && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
        </div>
    );
};

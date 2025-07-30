'use client';

import { Input, Button, Card, CardBody, Image, Divider } from '@heroui/react';
import { useState, useMemo } from 'react';
import { SearchIcon, CloseIcon } from '@heroui/shared-icons';
import { SearchResult } from './types';

interface SearchBarProps {
    className?: string;
}

// Mock search data
const MOCK_SEARCH_RESULTS: SearchResult[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 52999,
        category: 'Elektronik',
        image: '/api/placeholder/40/40',
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24',
        price: 35999,
        category: 'Elektronik',
        image: '/api/placeholder/40/40',
    },
    {
        id: '3',
        name: 'MacBook Pro M3',
        price: 65999,
        category: 'Bilgisayar',
        image: '/api/placeholder/40/40',
    },
    {
        id: '4',
        name: 'Nike Air Max',
        price: 3499,
        category: 'Ayakkabı',
        image: '/api/placeholder/40/40',
    },
    {
        id: '5',
        name: 'Adidas Ultraboost',
        price: 4299,
        category: 'Ayakkabı',
        image: '/api/placeholder/40/40',
    },
    {
        id: '6',
        name: 'Sony WH-1000XM5',
        price: 8999,
        category: 'Ses Sistemleri',
        image: '/api/placeholder/40/40',
    },
];

export const SearchBar = ({ className }: SearchBarProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Responsive placeholder
    const getPlaceholder = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            return 'Ürün ara...';
        }
        return 'Ürün, kategori veya marka ara...';
    };

    const filteredResults = useMemo(() => {
        if (!searchValue) return [];

        return MOCK_SEARCH_RESULTS.filter(
            item =>
                item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.category.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [searchValue]);

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
                        'bg-default-50 border-2 border-default-200 hover:border-default-300 focus-within:border-primary-400 focus-within:bg-white transition-all duration-200 min-h-unit-12',
                    input: 'text-small placeholder:text-default-400 min-w-0',
                }}
                size="lg"
            />

            {/* Search Results Dropdown */}
            {isOpen && searchValue && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto shadow-xl border border-default-200">
                    <CardBody className="p-0">
                        {filteredResults.length > 0 ? (
                            <>
                                <div className="p-3 text-small text-default-600 bg-gradient-to-r from-default-50 to-default-100">
                                    <span className="font-medium">
                                        {filteredResults.length} sonuç bulundu
                                    </span>
                                    <span className="text-xs ml-2 text-default-500">
                                        "{searchValue}" için
                                    </span>
                                </div>
                                <Divider />
                                {filteredResults.map((result, index) => (
                                    <div key={result.id}>
                                        <div
                                            className="flex items-center gap-3 p-3 hover:bg-default-50 cursor-pointer transition-colors duration-200"
                                            onClick={() => {
                                                // Navigate to product page
                                                setSearchValue('');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <Image
                                                src={result.image}
                                                alt={result.name}
                                                className="w-12 h-12 object-cover ring-1 ring-default-200"
                                                radius="md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-small font-medium text-default-900 truncate">
                                                    {result.name}
                                                </p>
                                                <p className="text-tiny text-default-500 flex items-center gap-1">
                                                    <span>🏷️</span>
                                                    {result.category}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-small font-semibold text-primary-600">
                                                    {formatPrice(result.price)}
                                                </p>
                                            </div>
                                        </div>
                                        {index < filteredResults.length - 1 && (
                                            <Divider />
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="p-8 text-center text-default-500">
                                <SearchIcon className="mx-auto mb-3 w-8 h-8 text-default-300" />
                                <p className="text-small font-medium">
                                    Aradığınız ürün bulunamadı
                                </p>
                                <p className="text-tiny mt-1">
                                    Farklı anahtar kelimeler deneyin
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Backdrop - only show when search has results */}
            {isOpen && searchValue && filteredResults.length > 0 && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

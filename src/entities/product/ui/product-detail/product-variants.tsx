'use client';

import { Button, Chip } from '@heroui/react';
import type { ProductVariant } from '../../model';

interface ProductVariantsProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onVariantChange: (variant: ProductVariant) => void;
}

export function ProductVariants({
    variants,
    selectedVariant,
    onVariantChange,
}: ProductVariantsProps) {
    // Variants yoksa veya tek variant varsa gösterme
    if (!variants || variants.length <= 1) {
        return null;
    }

    // Tüm variantlardan option tiplerini çıkar
    const getAllOptionTypes = () => {
        const optionTypes = new Set<string>();
        variants.forEach(variant => {
            variant.product_variant_options.forEach(option => {
                optionTypes.add(option.name);
            });
        });
        return Array.from(optionTypes);
    };

    // Belirli bir option type için tüm değerleri al
    const getOptionValues = (optionName: string) => {
        const values = new Set<string>();
        variants.forEach(variant => {
            const option = variant.product_variant_options.find(
                opt => opt.name === optionName
            );
            if (option) {
                values.add(option.value);
            }
        });
        return Array.from(values);
    };

    // Seçili variantın option değerini al
    const getSelectedOptionValue = (optionName: string) => {
        const option = selectedVariant.product_variant_options.find(
            opt => opt.name === optionName
        );
        return option?.value;
    };

    // Belirli option seçimlerine göre variant bul
    const getVariantByOptions = (targetOptions: Record<string, string>) => {
        return variants.find(variant => {
            return Object.entries(targetOptions).every(
                ([optionName, optionValue]) => {
                    const variantOption = variant.product_variant_options.find(
                        opt => opt.name === optionName
                    );
                    return variantOption?.value === optionValue;
                }
            );
        });
    };

    const priceRanges = [...new Set(variants.map(v => v.price))].sort(
        (a, b) => a - b
    );

    const isVariantAvailable = (variant: ProductVariant) => {
        return variant.stock > 0;
    };

    const optionTypes = getAllOptionTypes();

    return (
        <div className="space-y-6">
            {/* Variant Options */}
            {optionTypes.map(optionName => {
                const optionValues = getOptionValues(optionName);
                const selectedValue = getSelectedOptionValue(optionName);

                if (optionValues.length <= 1) return null;

                return (
                    <div key={optionName} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">
                                {optionName}:{' '}
                                <span className="font-normal text-default-600">
                                    {selectedValue || 'Seçilmedi'}
                                </span>
                            </p>
                            <span className="text-xs text-default-500">
                                Stok: {selectedVariant.stock} adet
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {optionValues.map(value => {
                                // Mevcut seçili optionları al
                                const currentOptions: Record<string, string> =
                                    {};
                                selectedVariant.product_variant_options.forEach(
                                    opt => {
                                        currentOptions[opt.name] = opt.value;
                                    }
                                );

                                // Bu option değerini güncelle
                                const targetOptions = {
                                    ...currentOptions,
                                    [optionName]: value,
                                };

                                const variant =
                                    getVariantByOptions(targetOptions);
                                const isSelected = selectedValue === value;
                                const isAvailable = variant
                                    ? isVariantAvailable(variant)
                                    : false;

                                return (
                                    <Button
                                        key={value}
                                        variant={
                                            isSelected ? 'solid' : 'bordered'
                                        }
                                        color={
                                            isSelected ? 'primary' : 'default'
                                        }
                                        size="sm"
                                        className={`
                                            min-w-12 h-10 font-medium
                                            ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                            ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                                        `}
                                        onPress={() => {
                                            if (isAvailable && variant) {
                                                onVariantChange(variant);
                                            }
                                        }}
                                        isDisabled={!isAvailable}
                                    >
                                        {value}
                                        {!isAvailable && (
                                            <span className="ml-1 text-xs">
                                                ×
                                            </span>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Price Information */}
            <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                    Fiyat Bilgisi
                </p>
                <div className="bg-default-50 rounded-lg p-4 border border-default-200">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-primary">
                                    ₺
                                    {selectedVariant.price.toLocaleString(
                                        'tr-TR'
                                    )}
                                </span>
                                {selectedVariant.compare_at_price &&
                                    selectedVariant.compare_at_price >
                                        selectedVariant.price && (
                                        <span className="text-sm text-default-500 line-through">
                                            ₺
                                            {selectedVariant.compare_at_price.toLocaleString(
                                                'tr-TR'
                                            )}
                                        </span>
                                    )}
                            </div>
                            {selectedVariant.compare_at_price &&
                                selectedVariant.compare_at_price >
                                    selectedVariant.price && (
                                    <div className="flex items-center gap-2">
                                        <Chip
                                            color="success"
                                            size="sm"
                                            variant="flat"
                                            className="font-medium"
                                        >
                                            %
                                            {Math.round(
                                                ((selectedVariant.compare_at_price -
                                                    selectedVariant.price) /
                                                    selectedVariant.compare_at_price) *
                                                    100
                                            )}{' '}
                                            İndirim
                                        </Chip>
                                    </div>
                                )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-default-500">SKU</p>
                            <p className="text-sm font-mono text-default-600">
                                {selectedVariant.sku}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Variants Price Comparison */}
            {priceRanges.length > 1 && (
                <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">
                        Fiyat Seçenekleri
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {priceRanges.map((price, index) => {
                            const variantsWithPrice = variants.filter(
                                v => v.price === price
                            );
                            const isCurrentPrice =
                                selectedVariant.price === price;

                            return (
                                <Chip
                                    key={`${price}-${index}`}
                                    variant={
                                        isCurrentPrice ? 'solid' : 'bordered'
                                    }
                                    color={
                                        isCurrentPrice ? 'primary' : 'default'
                                    }
                                    size="sm"
                                    className="font-medium"
                                >
                                    ₺{price.toLocaleString('tr-TR')}
                                    <span className="ml-1 text-xs opacity-70">
                                        ({variantsWithPrice.length} seçenek)
                                    </span>
                                </Chip>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductVariants;

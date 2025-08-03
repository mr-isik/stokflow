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
    // Group variants by color and size
    const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
    const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

    const getVariantBySelection = (color?: string, size?: string) => {
        return variants.find(
            v => (!color || v.color === color) && (!size || v.size === size)
        );
    };

    const isVariantAvailable = (color?: string, size?: string) => {
        const variant = getVariantBySelection(color, size);
        return variant && variant.stock > 0;
    };

    if (variants.length <= 1) {
        return null; // Don't show variant selector if there's only one variant
    }

    return (
        <div className="space-y-4">
            {/* Color Selection */}
            {colors.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Renk:{' '}
                        <span className="font-normal text-default-600">
                            {selectedVariant.color}
                        </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map(color => {
                            const isSelected = selectedVariant.color === color;
                            const isAvailable = isVariantAvailable(
                                color,
                                selectedVariant.size
                            );

                            return (
                                <Button
                                    key={color}
                                    variant={isSelected ? 'solid' : 'bordered'}
                                    color={isSelected ? 'primary' : 'default'}
                                    size="sm"
                                    className={`
                                        min-w-16 h-10
                                        ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    onPress={() => {
                                        if (isAvailable) {
                                            const variant =
                                                getVariantBySelection(
                                                    color,
                                                    selectedVariant.size
                                                );
                                            if (variant) {
                                                onVariantChange(variant);
                                            }
                                        }
                                    }}
                                    isDisabled={!isAvailable}
                                >
                                    {color}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Beden:{' '}
                        <span className="font-normal text-default-600">
                            {selectedVariant.size}
                        </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => {
                            const isSelected = selectedVariant.size === size;
                            const isAvailable = isVariantAvailable(
                                selectedVariant.color,
                                size
                            );

                            return (
                                <Button
                                    key={size}
                                    variant={isSelected ? 'solid' : 'bordered'}
                                    color={isSelected ? 'primary' : 'default'}
                                    size="sm"
                                    className={`
                                        min-w-12 h-10
                                        ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    onPress={() => {
                                        if (isAvailable) {
                                            const variant =
                                                getVariantBySelection(
                                                    selectedVariant.color,
                                                    size
                                                );
                                            if (variant) {
                                                onVariantChange(variant);
                                            }
                                        }
                                    }}
                                    isDisabled={!isAvailable}
                                >
                                    {size}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Price Comparison */}
            {variants.length > 1 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Fiyat Seçenekleri
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {variants
                            .filter(
                                (variant, index, self) =>
                                    self.findIndex(
                                        v => v.price === variant.price
                                    ) === index
                            )
                            .sort((a, b) => a.price - b.price)
                            .map((variant, index) => (
                                <Chip
                                    key={`${variant.price}-${index}`}
                                    variant={
                                        variant.id === selectedVariant.id
                                            ? 'solid'
                                            : 'bordered'
                                    }
                                    color={
                                        variant.id === selectedVariant.id
                                            ? 'primary'
                                            : 'default'
                                    }
                                    size="sm"
                                >
                                    ₺{variant.price.toLocaleString('tr-TR')}
                                </Chip>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductVariants;

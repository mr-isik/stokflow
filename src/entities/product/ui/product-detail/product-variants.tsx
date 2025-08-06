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
    // Extract options from variant options
    const getOptionValue = (variant: ProductVariant, optionName: string) => {
        return variant.product_variant_options?.find(
            opt => opt.name.toLowerCase() === optionName.toLowerCase()
        )?.value;
    };

    // Group variants by option types
    const colors = [
        ...new Set(
            variants.map(v => getOptionValue(v, 'renk')).filter(Boolean)
        ),
    ];
    const sizes = [
        ...new Set(
            variants.map(v => getOptionValue(v, 'beden')).filter(Boolean)
        ),
    ];

    const getVariantBySelection = (color?: string, size?: string) => {
        return variants.find(v => {
            const variantColor = getOptionValue(v, 'renk');
            const variantSize = getOptionValue(v, 'beden');
            return (
                (!color || variantColor === color) &&
                (!size || variantSize === size)
            );
        });
    };

    const isVariantAvailable = (color?: string, size?: string) => {
        const variant = getVariantBySelection(color, size);
        return variant && variant.stock > 0;
    };

    if (variants.length <= 1) {
        return null; // Don't show variant selector if there's only one variant
    }

    const selectedColor = getOptionValue(selectedVariant, 'renk');
    const selectedSize = getOptionValue(selectedVariant, 'beden');

    return (
        <div className="space-y-4">
            {/* Color Selection */}
            {colors.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Renk:{' '}
                        <span className="font-normal text-default-600">
                            {selectedColor}
                        </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map(color => {
                            const isSelected = selectedColor === color;
                            const isAvailable = isVariantAvailable(
                                color,
                                selectedSize
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
                                                    selectedSize
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
                            {selectedSize}
                        </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map(size => {
                            const isSelected = selectedSize === size;
                            const isAvailable = isVariantAvailable(
                                selectedColor,
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
                                                    selectedColor,
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

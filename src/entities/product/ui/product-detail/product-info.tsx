'use client';

import { Button, Badge, Divider } from '@heroui/react';
import {
    IoStar,
    IoStarOutline,
    IoAdd,
    IoRemove,
    IoHeart,
    IoHeartOutline,
} from 'react-icons/io5';
import { useState } from 'react';
import type { Product, ProductVariant } from '../../model';

interface ProductInfoProps {
    product: Product;
    selectedVariant: ProductVariant;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
}

export function ProductInfo({
    product,
    selectedVariant,
    quantity,
    onQuantityChange,
    onAddToCart,
}: ProductInfoProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleQuantityDecrease = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleQuantityIncrease = () => {
        if (quantity < selectedVariant.stock) {
            onQuantityChange(quantity + 1);
        }
    };

    const isOutOfStock = selectedVariant.stock === 0;

    return (
        <div className="space-y-6">
            {/* Brand & Title */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {product.title}
                </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                    ₺{selectedVariant.price.toLocaleString('tr-TR')}
                </span>
                {selectedVariant.stock < 10 && selectedVariant.stock > 0 && (
                    <Badge color="warning" variant="flat">
                        Son {selectedVariant.stock} adet!
                    </Badge>
                )}
                {isOutOfStock && (
                    <Badge color="danger" variant="flat">
                        Stokta Yok
                    </Badge>
                )}
            </div>

            <Divider />

            {/* SKU & Stock Info */}
            <div className="space-y-2 text-sm">
                <p className="text-default-500">
                    <span className="font-medium">Ürün Kodu:</span>{' '}
                    {selectedVariant.sku}
                </p>
                <p className="text-default-500">
                    <span className="font-medium">Stok Durumu:</span>{' '}
                    <span
                        className={
                            isOutOfStock ? 'text-danger' : 'text-success'
                        }
                    >
                        {isOutOfStock
                            ? 'Stokta Yok'
                            : `${selectedVariant.stock} adet mevcut`}
                    </span>
                </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Adet</p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border-2 border-default-200 rounded-lg">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={handleQuantityDecrease}
                                isDisabled={quantity <= 1}
                                className="min-w-unit-10"
                            >
                                <IoRemove className="w-4 h-4" />
                            </Button>

                            <span className="w-12 text-center font-medium">
                                {quantity}
                            </span>

                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={handleQuantityIncrease}
                                isDisabled={quantity >= selectedVariant.stock}
                                className="min-w-unit-10"
                            >
                                <IoAdd className="w-4 h-4" />
                            </Button>
                        </div>

                        <span className="text-sm text-default-500">
                            Toplam: ₺
                            {(selectedVariant.price * quantity).toLocaleString(
                                'tr-TR'
                            )}
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    color="primary"
                    size="lg"
                    className="flex-1"
                    onPress={onAddToCart}
                    isDisabled={isOutOfStock}
                >
                    {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
                </Button>

                <Button
                    isIconOnly
                    variant="bordered"
                    size="lg"
                    onPress={() => setIsWishlisted(!isWishlisted)}
                    className="w-12"
                >
                    {isWishlisted ? (
                        <IoHeart className="w-5 h-5 text-danger" />
                    ) : (
                        <IoHeartOutline className="w-5 h-5" />
                    )}
                </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
                <Button
                    variant="flat"
                    size="sm"
                    className="flex-1"
                    isDisabled={isOutOfStock}
                >
                    Hemen Al
                </Button>
                <Button variant="flat" size="sm" className="flex-1">
                    Karşılaştır
                </Button>
            </div>
        </div>
    );
}

export default ProductInfo;

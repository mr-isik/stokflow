'use client';

import { useState } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { IoStorefrontOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/features/cart/hooks/queries';
import { useCartItems } from '@/features/cart/hooks/use-cart-items';
import {
    QuantityControls,
    RemoveButton,
    CartItemImage,
    VariantOptions,
    CartItemPrice,
} from '@/features/cart/ui/components';
import { WithCartState } from '@/features/cart/ui/states';
import { CartOrderSummary } from '@/features/cart/ui/order-summary';
import { CartItem } from '@/features/cart/model';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';

const CartPage = () => {
    const router = useRouter();
    const { cart, isError, isLoading } = useCart();
    const {
        updateQuantity,
        handleRemoveItem,
        isItemLoading,
        isItemUpdating,
        isItemRemoving,
    } = useCartItems();

    const [couponCode, setCouponCode] = useState('');

    return (
        <WithCartState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!cart || cart.items.length === 0}
            wrapper={({ children }) => (
                <MaxWidthWrapper className="py-8">{children}</MaxWidthWrapper>
            )}
        >
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground">
                        Sepetim ({cart?.items.length || 0} ürün)
                    </h1>
                    <Button
                        as={Link}
                        href="/"
                        variant="light"
                        startContent={
                            <IoStorefrontOutline className="w-4 h-4" />
                        }
                    >
                        Alışverişe Devam Et
                    </Button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="xl:col-span-2 space-y-4">
                        {cart?.items.map((item: CartItem) => (
                            <Card
                                key={item.id}
                                className="border border-neutral-200 shadow-none p-1.5"
                            >
                                <CardBody>
                                    <div
                                        className={`flex gap-4 transition-opacity duration-200 ${isItemLoading(item.id) ? 'opacity-60' : 'opacity-100'}`}
                                    >
                                        {/* Product Image */}
                                        <CartItemImage
                                            item={item}
                                            size={96}
                                            className={`flex-shrink-0 ${isItemLoading(item.id) ? 'opacity-50' : ''}`}
                                        />

                                        <div className="flex-1 min-w-0">
                                            {/* Product Info */}
                                            <div className="mb-3">
                                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                                    {
                                                        item.variants.product
                                                            .title
                                                    }
                                                </h3>

                                                {/* Variant Options */}
                                                <VariantOptions
                                                    item={item}
                                                    size="sm"
                                                />

                                                <p className="text-sm text-default-500 mt-1">
                                                    SKU: {item.variants.sku}
                                                </p>
                                            </div>

                                            {/* Price and Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Quantity Controls */}
                                                    <QuantityControls
                                                        item={item}
                                                        onUpdateQuantity={
                                                            updateQuantity
                                                        }
                                                        isLoading={isItemUpdating(
                                                            item.id
                                                        )}
                                                        isDisabled={isItemLoading(
                                                            item.id
                                                        )}
                                                        variant="bordered"
                                                    />

                                                    {/* Remove Button */}
                                                    <RemoveButton
                                                        itemId={item.id}
                                                        onRemove={
                                                            handleRemoveItem
                                                        }
                                                        isLoading={isItemRemoving(
                                                            item.id
                                                        )}
                                                        isDisabled={isItemLoading(
                                                            item.id
                                                        )}
                                                    />
                                                </div>

                                                {/* Price */}
                                                <CartItemPrice
                                                    item={item}
                                                    showUnitPrice={true}
                                                    size="lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <CartOrderSummary
                        cart={cart!}
                        couponCode={couponCode}
                        onCouponCodeChange={setCouponCode}
                        onCheckout={() => router.push('/checkout')}
                    />
                </div>
            </div>
        </WithCartState>
    );
};

export default CartPage;

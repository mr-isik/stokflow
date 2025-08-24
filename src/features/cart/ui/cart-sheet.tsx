'use client';

import { useState } from 'react';
import {
    Button,
    Badge,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
    Divider,
    Chip,
    Image,
} from '@heroui/react';
import { ShoppingCartBoldIcon, DeleteIcon } from '@heroui/shared-icons';
import { useCart } from '../hooks/queries';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/mutations';
import { CartItem } from '../model';
import { IoAlert } from 'react-icons/io5';

interface CartDropdownProps {
    className?: string;
}

export const CartDropdown = ({ className }: CartDropdownProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { cart, isError, isLoading } = useCart();
    const { mutate: updateCartItem } = useUpdateCartItem();
    const { mutate: removeCartItem } = useRemoveCartItem();

    // Track which items are being updated/removed
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

    if (isLoading) {
        return null;
    }

    if (isError) {
        return <IoAlert className="text-danger" />;
    }

    if (!cart) {
        return null;
    }

    const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(price);
    };

    const updateQuantity = (itemId: number, newQuantity: number) => {
        setUpdatingItems(prev => new Set(prev).add(itemId));

        if (newQuantity <= 0) {
            setRemovingItems(prev => new Set(prev).add(itemId));
            removeCartItem(itemId, {
                onSettled: () => {
                    setRemovingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                    setUpdatingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                },
            });
            return;
        }

        updateCartItem(
            { itemId, quantity: newQuantity },
            {
                onSettled: () => {
                    setUpdatingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemId);
                        return newSet;
                    });
                },
            }
        );
    };

    const handleRemoveItem = (itemId: number) => {
        setRemovingItems(prev => new Set(prev).add(itemId));
        removeCartItem(itemId, {
            onSettled: () => {
                setRemovingItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            },
        });
    };

    return (
        <div className={className}>
            <Button
                isIconOnly
                variant="light"
                className="relative text-default-600 hover:text-primary hover:bg-primary-50 transition-all duration-200"
                size="lg"
                onPress={onOpen}
            >
                <Badge
                    content={cart.items.length}
                    color="danger"
                    size="sm"
                    isInvisible={cart.items.length === 0}
                    className="text-white"
                >
                    <ShoppingCartBoldIcon className="w-6 h-6" />
                </Badge>
            </Button>

            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement="right"
                size="md"
                backdrop="blur"
            >
                <DrawerContent>
                    <DrawerHeader className="flex items-center justify-between border-b border-default-200">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">Sepetim</h3>
                            <Chip size="sm" color="primary" variant="flat">
                                {cart.items.length} ürün
                            </Chip>
                        </div>
                    </DrawerHeader>

                    <DrawerBody className="p-0">
                        {cart.items.length > 0 ? (
                            <div className="flex flex-col h-full">
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto">
                                    {cart.items.map((item: CartItem, index) => {
                                        const featuredImage =
                                            item.variants.product.product_images.find(
                                                img => img.is_featured
                                            ) ||
                                            item.variants.product
                                                .product_images[0];

                                        const isItemLoading =
                                            updatingItems.has(item.id) ||
                                            removingItems.has(item.id);

                                        return (
                                            <div key={item.id}>
                                                <div
                                                    className={`p-4 flex items-start gap-4 transition-opacity duration-200 ${isItemLoading ? 'opacity-60' : 'opacity-100'}`}
                                                >
                                                    {/* Product Image */}
                                                    {featuredImage && (
                                                        <div
                                                            className={`w-16 h-16 flex-shrink-0 ${isItemLoading ? 'opacity-50' : ''}`}
                                                        >
                                                            <Image
                                                                src={
                                                                    featuredImage.url
                                                                }
                                                                alt={
                                                                    featuredImage.alt
                                                                }
                                                                width={64}
                                                                height={64}
                                                                className="object-cover rounded-lg border border-default-200"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-medium text-default-900 mb-1">
                                                            {
                                                                item.variants
                                                                    .product
                                                                    .title
                                                            }
                                                        </h4>

                                                        {/* Variant Options */}
                                                        {item.variants
                                                            .variant_options
                                                            .length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                {item.variants.variant_options.map(
                                                                    (
                                                                        option,
                                                                        idx
                                                                    ) => (
                                                                        <Chip
                                                                            key={
                                                                                idx
                                                                            }
                                                                            size="sm"
                                                                            variant="flat"
                                                                            color="default"
                                                                            className="text-xs"
                                                                        >
                                                                            {
                                                                                option.name
                                                                            }
                                                                            :{' '}
                                                                            {
                                                                                option.value
                                                                            }
                                                                        </Chip>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}

                                                        <p className="text-lg font-semibold text-primary mb-3">
                                                            {formatPrice(
                                                                item.variants
                                                                    .price
                                                            )}
                                                        </p>

                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                onPress={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1
                                                                    )
                                                                }
                                                                className="min-w-unit-8 w-8 h-8"
                                                                isLoading={updatingItems.has(
                                                                    item.id
                                                                )}
                                                                isDisabled={
                                                                    updatingItems.has(
                                                                        item.id
                                                                    ) ||
                                                                    removingItems.has(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <span className="text-sm font-bold">
                                                                    −
                                                                </span>
                                                            </Button>

                                                            <span
                                                                className={`text-base font-medium min-w-[3rem] text-center bg-default-100 px-3 py-1 rounded-lg ${isItemLoading ? 'opacity-50' : ''}`}
                                                            >
                                                                {item.quantity}
                                                            </span>

                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="flat"
                                                                onPress={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                className="min-w-unit-8 w-8 h-8"
                                                                isLoading={updatingItems.has(
                                                                    item.id
                                                                )}
                                                                isDisabled={
                                                                    updatingItems.has(
                                                                        item.id
                                                                    ) ||
                                                                    removingItems.has(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <span className="text-sm font-bold">
                                                                    +
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        color="danger"
                                                        className="self-start"
                                                        onPress={() =>
                                                            handleRemoveItem(
                                                                item.id
                                                            )
                                                        }
                                                        isLoading={removingItems.has(
                                                            item.id
                                                        )}
                                                        isDisabled={
                                                            removingItems.has(
                                                                item.id
                                                            ) ||
                                                            updatingItems.has(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {index <
                                                    cart.items.length - 1 && (
                                                    <Divider />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <ShoppingCartBoldIcon className="w-16 h-16 mb-4 text-default-300" />
                                <h3 className="text-lg font-semibold text-default-700 mb-2">
                                    Sepetiniz boş
                                </h3>
                                <p className="text-default-500 mb-6">
                                    Alışverişe başlamak için ürün ekleyin
                                </p>
                                <Button
                                    color="primary"
                                    size="lg"
                                    onPress={onClose}
                                >
                                    Alışverişe Başla
                                </Button>
                            </div>
                        )}
                    </DrawerBody>

                    {cart.items.length > 0 && (
                        <DrawerFooter className="border-t border-default-200 bg-default-50">
                            <div className="w-full space-y-4">
                                {/* Total */}
                                <div className="flex justify-between items-center">
                                    <span className="text-base text-default-600">
                                        Toplam:
                                    </span>
                                    <span className="text-xl font-bold text-default-900">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        color="primary"
                                        size="lg"
                                        className="w-full shadow-lg"
                                        onPress={() => {
                                            onClose();
                                            // Navigate to checkout
                                        }}
                                    >
                                        🚀 Sipariş Ver
                                    </Button>

                                    <Button
                                        variant="bordered"
                                        size="lg"
                                        className="w-full"
                                        onPress={() => {
                                            onClose();
                                            // Navigate to cart
                                        }}
                                    >
                                        📋 Sepeti Görüntüle
                                    </Button>
                                </div>
                            </div>
                        </DrawerFooter>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
};

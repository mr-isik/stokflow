'use client';

import {
    Button,
    Badge,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
    Image,
    Divider,
    Chip,
} from '@heroui/react';
import { ShoppingCartBoldIcon, DeleteIcon } from '@heroui/shared-icons';
import { useState } from 'react';
import { CartItem } from './types';
import { MOCK_CART_ITEMS } from './mock-data';

interface CartDropdownProps {
    className?: string;
}

export const CartDropdown = ({ className }: CartDropdownProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(price);
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }

        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id));
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
                    content={totalItems}
                    color="danger"
                    size="sm"
                    isInvisible={totalItems === 0}
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
                                {totalItems} ürün
                            </Chip>
                        </div>
                    </DrawerHeader>

                    <DrawerBody className="p-0">
                        {cartItems.length > 0 ? (
                            <div className="flex flex-col h-full">
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto">
                                    {cartItems.map((item, index) => (
                                        <div key={item.id}>
                                            <div className="p-4 flex items-start gap-4">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover ring-1 ring-default-200"
                                                    radius="lg"
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-medium text-default-900 mb-1">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-lg font-semibold text-primary mb-3">
                                                        {formatPrice(
                                                            item.price
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
                                                        >
                                                            <span className="text-sm font-bold">
                                                                −
                                                            </span>
                                                        </Button>

                                                        <span className="text-base font-medium min-w-[3rem] text-center bg-default-100 px-3 py-1 rounded-lg">
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
                                                    onPress={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="self-start"
                                                >
                                                    <DeleteIcon className="w-5 h-5" />
                                                </Button>
                                            </div>

                                            {index < cartItems.length - 1 && (
                                                <Divider />
                                            )}
                                        </div>
                                    ))}
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

                    {cartItems.length > 0 && (
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

'use client';

import {
    Button,
    Badge,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Divider,
    Chip,
} from '@heroui/react';
import { ShoppingCartBoldIcon } from '@heroui/shared-icons';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/queries';
import { useCartItems } from '../hooks/use-cart-items';
import { formatPrice, calculateCartTotals } from '../lib/utils';
import {
    QuantityControls,
    RemoveButton,
    CartItemImage,
    VariantOptions,
    CartItemPrice,
} from './components';
import { EmptyCartState } from './states';
import { CartItem } from '../model';
import { IoAlert } from 'react-icons/io5';

interface CartDropdownProps {
    className?: string;
}

export const CartDropdown = ({ className }: CartDropdownProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const { cart, isError, isLoading } = useCart();
    const {
        updateQuantity,
        handleRemoveItem,
        isItemLoading,
        isItemUpdating,
        isItemRemoving,
    } = useCartItems();

    if (isLoading) {
        return null;
    }

    if (isError) {
        return <IoAlert className="text-danger" />;
    }

    if (!cart) {
        return null;
    }

    const totals = calculateCartTotals(cart.items);

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
                            <div className="flex flex-col h-full w-full">
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                                    {cart.items.map((item: CartItem, index) => (
                                        <div key={item.id}>
                                            <div
                                                className={`p-4 flex items-start gap-4 transition-opacity duration-200 ${isItemLoading(item.id) ? 'opacity-60' : 'opacity-100'}`}
                                            >
                                                {/* Product Image */}
                                                <CartItemImage
                                                    item={item}
                                                    size={64}
                                                    className={`flex-shrink-0 border border-default-200 ${isItemLoading(item.id) ? 'opacity-50' : ''}`}
                                                />

                                                <div className="flex-1 min-w-0 overflow-hidden">
                                                    <h4 className="text-base font-medium text-default-900 mb-1 truncate">
                                                        {
                                                            item.variants
                                                                .product.title
                                                        }
                                                    </h4>

                                                    {/* Variant Options */}
                                                    <VariantOptions
                                                        item={item}
                                                        size="sm"
                                                        maxVisible={2}
                                                    />

                                                    <div className="mb-3">
                                                        <CartItemPrice
                                                            item={item}
                                                            size="md"
                                                            showUnitPrice={
                                                                false
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between gap-2">
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
                                                            variant="compact"
                                                            size="sm"
                                                        />

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
                                                            variant="icon-only"
                                                            size="sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {index < cart.items.length - 1 && (
                                                <Divider className="mx-4" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Footer with total and checkout */}
                                <div className="border-t border-default-200 p-4 space-y-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Toplam:</span>
                                        <span className="text-primary">
                                            {formatPrice(totals.total)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="bordered"
                                            onPress={() => {
                                                onClose();
                                                router.push('/cart');
                                            }}
                                        >
                                            Sepeti Görüntüle
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={() => {
                                                onClose();
                                                router.push('/checkout');
                                            }}
                                        >
                                            Satın Al
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <EmptyCartState
                                compact
                                title="Sepetiniz boş"
                                description="Alışverişe başlamak için ürün ekleyin"
                                actionText="Alışverişe Başla"
                                actionHref="/"
                            />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

/**
 * Shared cart UI components
 * Reusable components for cart page and cart sheet
 */

import { Button, Chip, Image } from '@heroui/react';
import { IoAdd, IoRemove, IoTrashOutline } from 'react-icons/io5';
import { CartItem } from '../model';
import { formatPrice, getFeaturedImage } from '../lib/utils';

interface QuantityControlsProps {
    item: CartItem;
    onUpdateQuantity: (itemId: number, quantity: number) => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'bordered' | 'compact';
}

export const QuantityControls = ({
    item,
    onUpdateQuantity,
    isLoading = false,
    isDisabled = false,
    size = 'sm',
    variant = 'default',
}: QuantityControlsProps) => {
    const handleDecrease = () => onUpdateQuantity(item.id, item.quantity - 1);
    const handleIncrease = () => onUpdateQuantity(item.id, item.quantity + 1);

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-1">
                <Button
                    isIconOnly
                    size={size}
                    variant="flat"
                    onPress={handleDecrease}
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                    className="min-w-unit-8"
                >
                    <span className="text-sm font-bold">−</span>
                </Button>

                <span
                    className={`text-base font-medium min-w-[3rem] text-center bg-default-100 px-3 py-1 rounded-lg ${isDisabled ? 'opacity-50' : ''}`}
                >
                    {item.quantity}
                </span>

                <Button
                    isIconOnly
                    size={size}
                    variant="flat"
                    onPress={handleIncrease}
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                    className="min-w-unit-8"
                >
                    <span className="text-sm font-bold">+</span>
                </Button>
            </div>
        );
    }

    return (
        <div
            className={`flex items-center gap-1 ${variant === 'bordered' ? 'border-2 border-default-200 rounded-lg' : ''}`}
        >
            <Button
                isIconOnly
                size={size}
                variant="light"
                onPress={handleDecrease}
                isLoading={isLoading}
                isDisabled={isDisabled}
                className="min-w-unit-8"
            >
                <IoRemove className="w-4 h-4" />
            </Button>

            <span
                className={`min-w-[3rem] text-center font-medium px-2 ${isDisabled ? 'opacity-50' : ''}`}
            >
                {item.quantity}
            </span>

            <Button
                isIconOnly
                size={size}
                variant="light"
                onPress={handleIncrease}
                isLoading={isLoading}
                isDisabled={isDisabled}
                className="min-w-unit-8"
            >
                <IoAdd className="w-4 h-4" />
            </Button>
        </div>
    );
};

interface RemoveButtonProps {
    itemId: number;
    onRemove: (itemId: number) => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'icon-only';
}

export const RemoveButton = ({
    itemId,
    onRemove,
    isLoading = false,
    isDisabled = false,
    size = 'sm',
    variant = 'default',
}: RemoveButtonProps) => {
    if (variant === 'icon-only') {
        return (
            <Button
                isIconOnly
                size={size}
                variant="light"
                color="danger"
                onPress={() => onRemove(itemId)}
                isLoading={isLoading}
                isDisabled={isDisabled}
            >
                <IoTrashOutline className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <Button
            size={size}
            variant="light"
            color="danger"
            onPress={() => onRemove(itemId)}
            isLoading={isLoading}
            isDisabled={isDisabled}
            startContent={!isLoading && <IoTrashOutline className="w-4 h-4" />}
        >
            Kaldır
        </Button>
    );
};

interface CartItemImageProps {
    item: CartItem;
    size?: number;
    className?: string;
}

export const CartItemImage = ({
    item,
    size = 64,
    className = '',
}: CartItemImageProps) => {
    const featuredImage = getFeaturedImage(item);

    if (!featuredImage) {
        return (
            <div
                className={`bg-default-100 rounded-lg flex items-center justify-center ${className}`}
                style={{ width: size, height: size }}
            >
                <span className="text-default-400 text-xs">No Image</span>
            </div>
        );
    }

    return (
        <Image
            src={featuredImage.url}
            alt={featuredImage.alt}
            width={size}
            height={size}
            className={`object-cover rounded-lg ${className}`}
        />
    );
};

interface VariantOptionsProps {
    item: CartItem;
    size?: 'sm' | 'md';
    maxVisible?: number;
}

export const VariantOptions = ({
    item,
    size = 'sm',
    maxVisible,
}: VariantOptionsProps) => {
    if (
        !item.variants.variant_options.length ||
        item.variants.variant_options.length < 2
    ) {
        return null;
    }

    const options = maxVisible
        ? item.variants.variant_options.slice(0, maxVisible)
        : item.variants.variant_options;

    const hasMore =
        maxVisible && item.variants.variant_options.length > maxVisible;

    return (
        <div className="flex flex-wrap gap-1">
            {options.map((option, idx) => (
                <Chip
                    key={idx}
                    size={size}
                    variant="flat"
                    color="default"
                    className={size === 'sm' ? 'text-xs' : ''}
                >
                    {option.name}: {option.value}
                </Chip>
            ))}
            {hasMore && (
                <Chip size={size} variant="flat" color="default">
                    +{item.variants.variant_options.length - maxVisible!}
                </Chip>
            )}
        </div>
    );
};

interface CartItemPriceProps {
    item: CartItem;
    showUnitPrice?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const CartItemPrice = ({
    item,
    showUnitPrice = false,
    size = 'md',
}: CartItemPriceProps) => {
    const totalPrice = item.variants.price * item.quantity;
    const unitPrice = item.variants.price;

    const textSizeClass = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }[size];

    const unitTextSizeClass = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }[size];

    return (
        <div className="text-right">
            <p className={`${textSizeClass} font-bold text-foreground`}>
                {formatPrice(totalPrice)}
            </p>
            {showUnitPrice && (
                <p className={`${unitTextSizeClass} text-default-500`}>
                    {formatPrice(unitPrice)} / adet
                </p>
            )}
        </div>
    );
};

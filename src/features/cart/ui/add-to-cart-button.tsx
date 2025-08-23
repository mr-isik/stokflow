import { Button } from '@heroui/react';
import React from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { useAddToCart } from '../hooks/mutations';

type Props = {
    variantId: number;
};

const AddToCartButton = ({ variantId }: Props) => {
    const { mutate: addToCart, isPending } = useAddToCart(variantId);

    return (
        <Button
            color="primary"
            className="flex-1 text-sm font-medium"
            isLoading={isPending}
            size="sm"
            data-testid={`add-to-cart-${variantId}`}
            onPress={() => addToCart()}
        >
            {!isPending && (
                <>
                    <IoCartOutline className="w-4 h-4" />
                    Sepete Ekle
                </>
            )}
        </Button>
    );
};

export default AddToCartButton;

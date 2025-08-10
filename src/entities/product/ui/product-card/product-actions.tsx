import { Button } from '@heroui/react';
import { IoCartOutline } from 'react-icons/io5';

interface ProductActionsProps {
    onAddToCart: () => void;
    isLoading?: boolean;
    'data-testid'?: string;
}

function ProductActions({
    onAddToCart,
    isLoading = false,
    'data-testid': dataTestId,
}: ProductActionsProps) {
    return (
        <div className="flex gap-2 mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
                color="primary"
                className="flex-1 text-sm font-medium"
                startContent={<IoCartOutline className="w-4 h-4" />}
                onPress={onAddToCart}
                isLoading={isLoading}
                size="sm"
                data-testid={dataTestId}
            >
                Sepete Ekle
            </Button>
        </div>
    );
}

export default ProductActions;

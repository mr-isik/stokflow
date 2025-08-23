import AddToCartButton from '@/features/cart/ui/add-to-cart-button';

interface ProductActionsProps {
    variantId: number;
}

function ProductActions({ variantId }: ProductActionsProps) {
    return (
        <div className="flex gap-2 mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AddToCartButton variantId={variantId} />
        </div>
    );
}

export default ProductActions;

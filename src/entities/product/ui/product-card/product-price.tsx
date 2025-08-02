import { Product } from '../../model';

interface ProductPriceProps {
    variants: Product['product_variants'];
}

function ProductPrice({ variants }: ProductPriceProps) {
    return (
        <div className="font-semibold text-primary">
            {variants[0]?.price} TL
        </div>
    );
}

export default ProductPrice;

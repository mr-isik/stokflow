import { Image } from '@heroui/react';
import { Product } from '../../model';

interface ProductImageProps {
    image: Product['product_images'][0];
    title: string;
}

function ProductImage({ image, title }: ProductImageProps) {
    return (
        <Image
            src={image.url}
            alt={image.alt || title}
            className="w-full h-64 object-cover rounded-b-none"
            classNames={{
                wrapper: 'w-full h-64',
                img: 'w-full h-64 object-cover',
            }}
            fallbackSrc="/placeholder-product.jpg"
            loading="lazy"
        />
    );
}

export default ProductImage;

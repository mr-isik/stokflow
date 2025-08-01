import { ProductGrid } from '@/entities/product/ui/product-card.example';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import React from 'react';

const HomePage = () => {
    return (
        <MaxWidthWrapper className="py-8">
            <ProductGrid />
        </MaxWidthWrapper>
    );
};

export default HomePage;

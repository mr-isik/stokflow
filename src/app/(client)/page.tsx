import { ProductList } from '@/entities/product/ui/product-list';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';
import React from 'react';

const HomePage = () => {
    return (
        <MaxWidthWrapper className="py-8">
            <ProductList />
        </MaxWidthWrapper>
    );
};

export default HomePage;

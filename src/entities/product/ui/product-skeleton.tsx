'use client';

import { Card, CardBody, CardFooter, Skeleton } from '@heroui/react';

export function ProductCardSkeleton() {
    return (
        <Card className="shadow-none border border-foreground-200">
            <CardBody className="p-0">
                {/* Image skeleton */}
                <Skeleton className="w-full h-64 rounded-lg" />
            </CardBody>

            <CardFooter className="flex-col items-start gap-2 p-4">
                {/* Title skeleton */}
                <Skeleton className="w-3/4 h-5 rounded-lg mb-2" />
                <Skeleton className="w-1/2 h-4 rounded-lg mb-4" />

                {/* Price skeleton */}
                <Skeleton className="w-1/3 h-6 rounded-lg" />

                {/* Button skeleton */}
                <Skeleton className="w-full h-9 rounded-lg mt-4" />
            </CardFooter>
        </Card>
    );
}

interface ProductsSkeletonProps {
    count?: number;
}

export function ProductsSkeleton({ count = 10 }: ProductsSkeletonProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: count }, (_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    );
}

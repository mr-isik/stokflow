'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';

export function ProductDetailSkeleton() {
    return (
        <div className="w-full">
            {/* Breadcrumb Skeleton */}
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <span className="text-default-300">/</span>
                    <Skeleton className="h-4 w-20 rounded" />
                    <span className="text-default-300">/</span>
                    <Skeleton className="h-4 w-32 rounded" />
                </div>
            </div>

            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                {/* Product Images Skeleton */}
                <div className="w-full space-y-4">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <div className="flex gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton
                                key={i}
                                className="w-20 h-20 rounded-lg flex-shrink-0"
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="w-full space-y-6">
                    {/* Title & Brand */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-8 w-3/4 rounded" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} className="w-4 h-4 rounded" />
                            ))}
                        </div>
                        <Skeleton className="h-4 w-16 rounded" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>

                    {/* Price */}
                    <Skeleton className="h-10 w-32 rounded" />

                    {/* Divider */}
                    <div className="border-t border-default-200" />

                    {/* Product Info */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                    </div>

                    {/* Variants */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 rounded" />
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <Skeleton
                                        key={i}
                                        className="h-10 w-16 rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 rounded" />
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton
                                        key={i}
                                        className="h-10 w-12 rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-32 rounded-lg" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>

                        <div className="flex gap-3">
                            <Skeleton className="h-12 flex-1 rounded-lg" />
                            <Skeleton className="h-12 w-12 rounded-lg" />
                        </div>

                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                            <Skeleton className="h-10 flex-1 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Sections Skeleton */}
            <div className="space-y-8">
                {/* Features Skeleton */}
                <Card>
                    <CardBody className="space-y-4">
                        <Skeleton className="h-6 w-32 rounded" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="w-5 h-5 rounded flex-shrink-0 mt-0.5" />
                                    <Skeleton className="h-4 flex-1 rounded" />
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Reviews Skeleton */}
                <Card>
                    <CardBody className="space-y-6">
                        <Skeleton className="h-6 w-48 rounded" />

                        {/* Rating Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center space-y-3">
                                <Skeleton className="h-12 w-16 rounded mx-auto" />
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Skeleton
                                            key={i}
                                            className="w-5 h-5 rounded"
                                        />
                                    ))}
                                </div>
                                <Skeleton className="h-4 w-24 rounded mx-auto" />
                            </div>

                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton className="h-4 w-8 rounded" />
                                        <Skeleton className="h-2 flex-1 rounded" />
                                        <Skeleton className="h-4 w-8 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-3">
                                    <div className="flex gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32 rounded" />
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(j => (
                                                    <Skeleton
                                                        key={j}
                                                        className="w-4 h-4 rounded"
                                                    />
                                                ))}
                                            </div>
                                            <Skeleton className="h-4 w-full rounded" />
                                            <Skeleton className="h-4 w-3/4 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default ProductDetailSkeleton;

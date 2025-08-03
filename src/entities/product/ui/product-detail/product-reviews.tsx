'use client';

import { useState } from 'react';
import { Button, Progress, Avatar, Divider, Chip } from '@heroui/react';
import {
    IoStar,
    IoStarOutline,
    IoThumbsUp,
    IoThumbsUpOutline,
} from 'react-icons/io5';
import type { Review } from '../../model';

interface ProductReviewsProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export function ProductReviews({
    reviews,
    averageRating,
    totalReviews,
}: ProductReviewsProps) {
    const [visibleReviews, setVisibleReviews] = useState(5);
    const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(
        new Set()
    );

    const handleShowMore = () => {
        setVisibleReviews(prev => Math.min(prev + 5, reviews.length));
    };

    const handleHelpfulClick = (reviewId: number) => {
        setHelpfulReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
        const stars = [];
        const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <IoStar key={i} className={`${iconSize} text-yellow-500`} />
                ) : (
                    <IoStarOutline
                        key={i}
                        className={`${iconSize} text-gray-300`}
                    />
                )
            );
        }
        return stars;
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars

        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });

        return distribution.reverse(); // Show 5 stars first
    };

    const ratingDistribution = getRatingDistribution();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
                Müşteri Değerlendirmeleri
            </h3>

            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Rating */}
                <div className="space-y-3">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-2">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center gap-1 mb-2">
                            {renderStars(Math.floor(averageRating), 'md')}
                        </div>
                        <p className="text-sm text-default-600">
                            {totalReviews} değerlendirme
                        </p>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {ratingDistribution.map((count, index) => {
                        const starCount = 5 - index;
                        const percentage =
                            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                        return (
                            <div
                                key={starCount}
                                className="flex items-center gap-3 text-sm"
                            >
                                <span className="w-8 text-default-600">
                                    {starCount}★
                                </span>
                                <Progress
                                    value={percentage}
                                    className="flex-1"
                                    color="warning"
                                    size="sm"
                                />
                                <span className="w-8 text-default-600 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Divider />

            {/* Individual Reviews */}
            <div className="space-y-6">
                <h4 className="text-lg font-medium text-foreground">
                    Müşteri Yorumları
                </h4>

                {reviews.length === 0 ? (
                    <div className="text-center py-8 text-default-500">
                        Henüz değerlendirme bulunmuyor. İlk değerlendirmeyi siz
                        yapın!
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.slice(0, visibleReviews).map(review => (
                            <div key={review.id} className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Avatar
                                        name={review.user_name}
                                        size="sm"
                                        className="flex-shrink-0"
                                    />

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {review.user_name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        {renderStars(
                                                            review.rating
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-default-500">
                                                        {formatDate(
                                                            review.created_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={
                                                    review.rating >= 4
                                                        ? 'success'
                                                        : review.rating >= 3
                                                          ? 'warning'
                                                          : 'danger'
                                                }
                                            >
                                                {review.rating}/5
                                            </Chip>
                                        </div>

                                        <p className="text-default-700 leading-relaxed">
                                            {review.comment}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                startContent={
                                                    helpfulReviews.has(
                                                        review.id
                                                    ) ? (
                                                        <IoThumbsUp className="w-4 h-4" />
                                                    ) : (
                                                        <IoThumbsUpOutline className="w-4 h-4" />
                                                    )
                                                }
                                                onPress={() =>
                                                    handleHelpfulClick(
                                                        review.id
                                                    )
                                                }
                                                className={`
                                                    text-xs
                                                    ${
                                                        helpfulReviews.has(
                                                            review.id
                                                        )
                                                            ? 'text-primary'
                                                            : 'text-default-600'
                                                    }
                                                `}
                                            >
                                                Faydalı (
                                                {review.helpful_count +
                                                    (helpfulReviews.has(
                                                        review.id
                                                    )
                                                        ? 1
                                                        : 0)}
                                                )
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {review.id !==
                                    reviews[
                                        Math.min(
                                            visibleReviews - 1,
                                            reviews.length - 1
                                        )
                                    ].id && <Divider className="mt-4" />}
                            </div>
                        ))}

                        {visibleReviews < reviews.length && (
                            <div className="text-center">
                                <Button
                                    variant="bordered"
                                    onPress={handleShowMore}
                                >
                                    Daha Fazla Yorum Gör (
                                    {reviews.length - visibleReviews} kaldı)
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Write Review Button */}
            <div className="border-t border-default-200 pt-6">
                <Button
                    color="primary"
                    variant="bordered"
                    size="lg"
                    className="w-full md:w-auto"
                >
                    Değerlendirme Yaz
                </Button>
            </div>
        </div>
    );
}

export default ProductReviews;

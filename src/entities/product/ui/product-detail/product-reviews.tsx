'use client';

import { useState } from 'react';
import {
    Button,
    Progress,
    Avatar,
    Divider,
    Chip,
    Pagination,
} from '@heroui/react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { useReviews } from '@/entities/review/queries';

interface ProductReviewsProps {
    productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    const {
        data: reviewsResponse,
        isLoading,
        error,
    } = useReviews({
        productId,
        page: currentPage,
        limit: pageSize,
    });

    const reviews = reviewsResponse?.data || [];
    const pagination = reviewsResponse?.pagination;

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
        const distribution = [0, 0, 0, 0, 0];

        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating - 1]++;
            }
        });

        return distribution.reverse(); // Show 5 stars first
    };

    const ratingDistribution = getRatingDistribution();
    const totalReviews = pagination?.total || 0;
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">
                    Müşteri Değerlendirmeleri
                </h3>
                <div className="text-center py-8 text-default-500">
                    Yükleniyor...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">
                    Müşteri Değerlendirmeleri
                </h3>
                <div className="text-center py-8 text-danger">
                    Yorumlar yüklenirken bir hata oluştu.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2 py-4">
                <h3 className="text-2xl font-bold text-foreground">
                    Müşteri Değerlendirmeleri
                </h3>
                <p className="text-default-600">
                    Gerçek müşteri deneyimlerini keşfedin
                </p>
            </div>

            {/* Rating Summary */}
            <div className="bg-default-50 rounded-2xl p-6 border border-default-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <div className="text-5xl font-bold text-primary">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="flex justify-center gap-1">
                                {renderStars(Math.floor(averageRating), 'md')}
                            </div>
                            <p className="text-sm text-default-600 font-medium">
                                {totalReviews} müşteri değerlendirmesi
                            </p>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-foreground mb-4">
                            Değerlendirme Dağılımı
                        </h5>
                        {ratingDistribution.map((count, index) => {
                            const starCount = 5 - index;
                            const percentage =
                                totalReviews > 0
                                    ? (count / totalReviews) * 100
                                    : 0;

                            return (
                                <div
                                    key={starCount}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <span className="w-8 text-default-600 font-medium">
                                        {starCount}★
                                    </span>
                                    <Progress
                                        value={percentage}
                                        className="flex-1"
                                        color="primary"
                                        size="sm"
                                    />
                                    <span className="w-8 text-default-600 text-right font-medium">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Divider />

            {/* Individual Reviews */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h4 className="text-xl font-semibold text-foreground">
                        Müşteri Yorumları
                    </h4>
                    {totalReviews > 0 && (
                        <span className="text-sm text-default-500 bg-default-100 px-3 py-1 rounded-full">
                            {pagination?.total || 0} toplam yorum
                        </span>
                    )}
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                        <div className="text-6xl">💭</div>
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-default-600">
                                Henüz değerlendirme bulunmuyor
                            </p>
                            <p className="text-sm text-default-500">
                                İlk değerlendirmeyi siz yapın ve diğer
                                müşterilere yardımcı olun!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div
                                key={review.id}
                                className="bg-default-50 rounded-xl p-6 border border-default-200"
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar
                                        size="md"
                                        className="flex-shrink-0 bg-primary text-white"
                                        name={`User ${review.user_id}`}
                                    />

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-0.5">
                                                        {renderStars(
                                                            review.rating
                                                        )}
                                                    </div>
                                                    <Chip
                                                        size="sm"
                                                        variant="flat"
                                                        color={
                                                            review.rating >= 4
                                                                ? 'success'
                                                                : review.rating >=
                                                                    3
                                                                  ? 'warning'
                                                                  : 'danger'
                                                        }
                                                        className="font-medium"
                                                    >
                                                        {review.rating}/5
                                                    </Chip>
                                                </div>
                                                <p className="text-xs text-default-500 font-medium">
                                                    {formatDate(
                                                        review.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-default-700 leading-relaxed text-sm">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-4">
                        <Pagination
                            page={currentPage + 1}
                            total={pagination.totalPages}
                            onChange={page => setCurrentPage(page - 1)}
                            showControls
                            showShadow
                            color="primary"
                            size="lg"
                        />
                    </div>
                )}
            </div>

            {/* Write Review Button */}
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center space-y-4">
                <div className="space-y-2">
                    <h5 className="text-lg font-semibold text-foreground">
                        Deneyiminizi Paylaşın
                    </h5>
                    <p className="text-sm text-default-600">
                        Bu ürün hakkındaki düşüncelerinizi diğer müşterilerle
                        paylaşın
                    </p>
                </div>
                <Button
                    color="primary"
                    size="lg"
                    className="font-medium px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    ⭐ Değerlendirme Yaz
                </Button>
            </div>
        </div>
    );
}

export default ProductReviews;

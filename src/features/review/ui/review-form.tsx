'use client';

import {
    Button,
    Textarea,
    Card,
    CardBody,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    addToast,
} from '@heroui/react';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { useAuth } from '@/shared/hooks';
import { useReviewForm } from '../hooks/use-review-form';

interface ReviewFormProps {
    productId: number;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function ReviewForm({ productId, onSuccess, trigger }: ReviewFormProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, isAuthenticated } = useAuth();

    const {
        form,
        values,
        errors,
        isSubmitting,
        handleSubmit,
        serverError,
        clearErrors,
    } = useReviewForm({
        productId,
        onSuccess: () => {
            onClose();
            onSuccess?.();
            addToast({
                title: 'Başarılı',
                description: 'Değerlendirmeniz başarıyla gönderildi.',
                color: 'success',
            });
        },
    });

    const { register, setValue, watch } = form;
    const rating = watch('rating');

    const handleRatingClick = (newRating: number) => {
        setValue('rating', newRating);
    };

    const handleModalClose = () => {
        clearErrors();
        form.resetForm();
        onClose();
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            stars.push(
                <button
                    key={i}
                    type="button"
                    className="transition-colors duration-200 hover:scale-110"
                    onClick={() => handleRatingClick(i)}
                >
                    {isFilled ? (
                        <IoStar className="w-8 h-8 text-yellow-500" />
                    ) : (
                        <IoStarOutline className="w-8 h-8 text-gray-300" />
                    )}
                </button>
            );
        }
        return stars;
    };

    const defaultTrigger = (
        <Button
            color="primary"
            size="lg"
            onPress={onOpen}
            className="font-medium px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            isDisabled={!isAuthenticated}
        >
            ⭐ Değerlendirme Yaz
        </Button>
    );

    return (
        <>
            {trigger ? (
                <div onClick={onOpen} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                defaultTrigger
            )}

            <Modal
                isOpen={isOpen}
                onClose={handleModalClose}
                size="2xl"
                scrollBehavior="inside"
                backdrop="blur"
            >
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-2xl font-bold text-foreground">
                                Ürün Değerlendirmesi
                            </h3>
                            <p className="text-sm text-default-600">
                                Deneyiminizi diğer müşterilerle paylaşın
                            </p>
                        </ModalHeader>

                        <ModalBody className="gap-6">
                            {!isAuthenticated ? (
                                <Card className="bg-warning-50 border border-warning-200">
                                    <CardBody className="text-center py-6">
                                        <p className="text-warning-700 font-medium">
                                            Değerlendirme yapmak için giriş
                                            yapmanız gerekiyor
                                        </p>
                                        <Button
                                            color="warning"
                                            variant="flat"
                                            size="sm"
                                            className="mt-3"
                                        >
                                            Giriş Yap
                                        </Button>
                                    </CardBody>
                                </Card>
                            ) : (
                                <>
                                    {/* Server Error */}
                                    {serverError && (
                                        <Card className="bg-danger-50 border border-danger-200">
                                            <CardBody className="py-3">
                                                <p className="text-danger-700 text-sm">
                                                    {serverError}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    )}

                                    {/* Rating Section */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-foreground">
                                            Puanınız *
                                        </label>
                                        <div className="flex items-center gap-2">
                                            {renderStars()}
                                            {rating > 0 && (
                                                <span className="ml-3 text-lg font-medium text-foreground">
                                                    {rating}/5
                                                </span>
                                            )}
                                        </div>
                                        {errors.rating && (
                                            <p className="text-danger text-sm">
                                                {errors.rating.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Comment Section */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-foreground">
                                            Yorumunuz *
                                        </label>
                                        <Textarea
                                            {...register('comment')}
                                            placeholder="Ürün hakkındaki deneyiminizi detaylı bir şekilde paylaşın..."
                                            maxRows={6}
                                            minRows={4}
                                            maxLength={500}
                                            classNames={{
                                                inputWrapper: errors.comment
                                                    ? 'border-danger'
                                                    : '',
                                            }}
                                        />
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-default-500">
                                                {values.comment?.length || 0}
                                                /500 karakter
                                            </span>
                                            {errors.comment && (
                                                <p className="text-danger text-sm">
                                                    {errors.comment.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <Card className="bg-default-50">
                                        <CardBody className="p-4">
                                            <p className="text-sm text-default-600">
                                                <strong>
                                                    {user?.user_metadata
                                                        ?.name ||
                                                        user?.email ||
                                                        'Kullanıcı'}
                                                </strong>{' '}
                                                olarak değerlendirme
                                                yapıyorsunuz
                                            </p>
                                        </CardBody>
                                    </Card>
                                </>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={handleModalClose}
                                isDisabled={isSubmitting}
                            >
                                İptal
                            </Button>
                            {isAuthenticated && (
                                <Button
                                    color="primary"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    isDisabled={
                                        rating === 0 || !values.comment?.trim()
                                    }
                                >
                                    {isSubmitting
                                        ? 'Gönderiliyor...'
                                        : 'Değerlendirmeyi Gönder'}
                                </Button>
                            )}
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ReviewForm;

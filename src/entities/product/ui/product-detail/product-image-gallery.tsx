'use client';

import { useState } from 'react';
import { Image, Button } from '@heroui/react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import type { ProductImage } from '../../model';

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handlePrevious = () => {
        setSelectedImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setSelectedImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    if (images.length === 0) {
        return (
            <div className="w-full aspect-square bg-default-100 rounded-lg flex items-center justify-center">
                <span className="text-default-500">Görsel bulunamadı</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden group">
                <Image
                    src={images[selectedImageIndex].url}
                    alt={images[selectedImageIndex].alt}
                    className="w-full h-full object-cover"
                    classNames={{
                        wrapper: 'w-full h-full',
                        img: 'w-full h-full object-cover',
                    }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            isIconOnly
                            variant="flat"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onPress={handlePrevious}
                        >
                            <IoChevronBack className="w-5 h-5" />
                        </Button>

                        <Button
                            isIconOnly
                            variant="flat"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onPress={handleNext}
                        >
                            <IoChevronForward className="w-5 h-5" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`
                                flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                                ${
                                    selectedImageIndex === index
                                        ? 'border-primary'
                                        : 'border-transparent hover:border-default-300'
                                }
                            `}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                classNames={{
                                    wrapper: 'w-full h-full',
                                    img: 'w-full h-full object-cover',
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductImageGallery;

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Image, Button } from '@heroui/react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductImage } from '../../model';

interface ProductImageGalleryProps {
    images: ProductImage[];
}

export function ProductImageGallery({ images = [] }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>(
        'right'
    );
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePrevious = useCallback(() => {
        if (images.length <= 1) return;
        setSlideDirection('left');
        setSelectedImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    }, [images.length]);

    const handleNext = useCallback(() => {
        if (images.length <= 1) return;
        setSlideDirection('right');
        setSelectedImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    }, [images.length]);

    const handleThumbnailClick = (index: number) => {
        if (index === selectedImageIndex) return;
        setSlideDirection(index > selectedImageIndex ? 'right' : 'left');
        setSelectedImageIndex(index);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                handlePrevious();
            } else if (event.key === 'ArrowRight') {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrevious]);

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
            <div
                ref={containerRef}
                className="relative w-full aspect-square bg-white overflow-hidden rounded-lg group cursor-pointer"
            >
                <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.div
                        key={selectedImageIndex}
                        custom={slideDirection}
                        initial={{
                            x: slideDirection === 'right' ? 300 : -300,
                            opacity: 0,
                        }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{
                            x: slideDirection === 'right' ? -300 : 300,
                            opacity: 0,
                        }}
                        transition={{
                            type: 'tween',
                            ease: 'easeInOut',
                            duration: 0.2,
                        }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[selectedImageIndex].url}
                            alt={images[selectedImageIndex].alt}
                            className="w-full h-full object-cover"
                            classNames={{
                                wrapper: 'w-full h-full',
                                img: 'w-full h-full object-cover',
                            }}
                        />
                    </motion.div>
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm 
                                     opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out
                                     hover:bg-white hover:scale-110 shadow-lg z-10"
                            onPress={handlePrevious}
                        >
                            <IoChevronBack className="w-4 h-4 text-default-700" />
                        </Button>

                        <Button
                            isIconOnly
                            variant="flat"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm 
                                     opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out
                                     hover:bg-white hover:scale-110 shadow-lg z-10"
                            onPress={handleNext}
                        >
                            <IoChevronForward className="w-4 h-4 text-default-700" />
                        </Button>
                    </>
                )}

                {images.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium
                                   backdrop-blur-sm transition-all duration-200 ease-in-out
                                   group-hover:bg-black/80 group-hover:scale-105"
                    >
                        <motion.span
                            key={selectedImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="transition-all duration-150"
                        >
                            {selectedImageIndex + 1} / {images.length}
                        </motion.span>
                    </motion.div>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ease-in-out
                                cursor-pointer relative p-[1px]
                                ${
                                    selectedImageIndex === index
                                        ? 'border-primary border-2'
                                        : 'bg-transparent hover:bg-default-100'
                                }
                            `}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <div className="w-full h-full rounded-xl overflow-hidden">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                    classNames={{
                                        wrapper: 'w-full h-full',
                                        img: 'w-full h-full object-cover transition-transform duration-200',
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductImageGallery;

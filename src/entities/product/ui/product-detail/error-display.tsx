'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { IoRefresh, IoWarning, IoSearch, IoHome } from 'react-icons/io5';

interface ErrorDisplayProps {
    type: 'error' | 'not-found' | 'network';
    title?: string;
    message?: string;
    onRetry?: () => void;
    onGoHome?: () => void;
}

export function ErrorDisplay({
    type,
    title,
    message,
    onRetry,
    onGoHome,
}: ErrorDisplayProps) {
    const getErrorConfig = () => {
        switch (type) {
            case 'not-found':
                return {
                    icon: <IoSearch className="w-16 h-16 text-default-400" />,
                    defaultTitle: 'Ürün Bulunamadı',
                    defaultMessage:
                        'Aradığınız ürün bulunamadı. Ürün kaldırılmış veya mevcut olmayabilir.',
                    color: 'default' as const,
                };
            case 'network':
                return {
                    icon: <IoWarning className="w-16 h-16 text-warning" />,
                    defaultTitle: 'Bağlantı Hatası',
                    defaultMessage:
                        'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
                    color: 'warning' as const,
                };
            default:
                return {
                    icon: <IoWarning className="w-16 h-16 text-danger" />,
                    defaultTitle: 'Bir Hata Oluştu',
                    defaultMessage:
                        'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.',
                    color: 'danger' as const,
                };
        }
    };

    const config = getErrorConfig();

    return (
        <div className="w-full flex items-center justify-center py-20">
            <Card className="max-w-md w-full">
                <CardBody className="text-center p-8">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Icon */}
                        <div className="p-4 rounded-full bg-default-100">
                            {config.icon}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-foreground">
                            {title || config.defaultTitle}
                        </h2>

                        {/* Message */}
                        <p className="text-default-600 text-center leading-relaxed">
                            {message || config.defaultMessage}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6 w-full">
                            {onRetry && (
                                <Button
                                    color={config.color}
                                    variant="solid"
                                    startContent={
                                        <IoRefresh className="w-4 h-4" />
                                    }
                                    onPress={onRetry}
                                    className="flex-1"
                                >
                                    Tekrar Dene
                                </Button>
                            )}

                            {onGoHome && (
                                <Button
                                    color="default"
                                    variant={onRetry ? 'bordered' : 'solid'}
                                    startContent={
                                        <IoHome className="w-4 h-4" />
                                    }
                                    onPress={onGoHome}
                                    className="flex-1"
                                >
                                    Ana Sayfa
                                </Button>
                            )}
                        </div>

                        {/* Additional Help */}
                        {type === 'error' && (
                            <div className="mt-4 p-3 bg-default-50 rounded-lg text-sm text-default-600">
                                <p className="font-medium mb-1">
                                    Sorun devam ediyorsa:
                                </p>
                                <ul className="text-left space-y-1 text-xs">
                                    <li>• Sayfayı yenileyin (F5)</li>
                                    <li>• Tarayıcı önbelleğini temizleyin</li>
                                    <li>
                                        • Müşteri hizmetlerimizle iletişime
                                        geçin
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default ErrorDisplay;

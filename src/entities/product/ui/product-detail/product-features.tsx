'use client';

import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import { IoCheckmarkCircle } from 'react-icons/io5';

interface ProductFeaturesProps {
    description: string;
    features: string[];
}

export function ProductFeatures({
    description,
    features,
}: ProductFeaturesProps) {
    return (
        <div className="w-full">
            <Tabs
                aria-label="Ürün Detayları"
                variant="underlined"
                className="w-full"
            >
                {/* Description Tab */}
                <Tab key="description" title="Ürün Açıklaması">
                    <Card className="shadow-none border border-default-200">
                        <CardBody className="p-6">
                            <div className="prose prose-sm max-w-none">
                                <p className="text-default-700 leading-relaxed whitespace-pre-line">
                                    {description}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* Features Tab */}
                <Tab key="features" title="Özellikler">
                    <Card className="shadow-none border border-default-200">
                        <CardBody className="p-6">
                            <div className="space-y-3">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <IoCheckmarkCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-default-700">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* Specifications Tab */}
                <Tab key="specifications" title="Teknik Özellikler">
                    <Card className="shadow-none border border-default-200">
                        <CardBody className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground border-b border-default-200 pb-2">
                                            Genel Bilgiler
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-default-600">
                                                    Marka:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    Premium Brand
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-default-600">
                                                    Model:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    2024 Edition
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-default-600">
                                                    Garanti:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    2 Yıl
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground border-b border-default-200 pb-2">
                                            Malzeme & Bakım
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-default-600">
                                                    Malzeme:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    Premium Quality
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-default-600">
                                                    Bakım:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    Kolay Temizlik
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-default-600">
                                                    Menşei:
                                                </span>
                                                <span className="text-foreground font-medium">
                                                    Türkiye
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                {/* Shipping & Returns Tab */}
                <Tab key="shipping" title="Kargo & İade">
                    <Card className="shadow-none border border-default-200">
                        <CardBody className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">
                                        Kargo Bilgileri
                                    </h4>
                                    <div className="space-y-2 text-sm text-default-700">
                                        <p>
                                            • Ücretsiz kargo: 500₺ ve üzeri
                                            siparişlerde
                                        </p>
                                        <p>• Standart kargo: 1-3 iş günü</p>
                                        <p>
                                            • Hızlı kargo: Aynı gün teslimat
                                            (seçili şehirlerde)
                                        </p>
                                        <p>• Kargo ücreti: 29.90₺</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-foreground mb-3">
                                        İade Koşulları
                                    </h4>
                                    <div className="space-y-2 text-sm text-default-700">
                                        <p>• 14 gün içinde ücretsiz iade</p>
                                        <p>
                                            • Ürün ambalajında ve etiketlerinde
                                            hasar olmamalı
                                        </p>
                                        <p>
                                            • İade kargo ücreti tarafımızdan
                                            karşılanır
                                        </p>
                                        <p>
                                            • Para iadesi 3-5 iş günü içinde
                                            hesabınıza yansır
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

export default ProductFeatures;

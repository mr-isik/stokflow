'use client';

import {
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
    Link,
    Divider,
    Accordion,
    AccordionItem,
} from '@heroui/react';
import { CloseIcon } from '@heroui/shared-icons';
import { MOCK_CATEGORIES } from './mock-data';

interface MobileMenuProps {
    className?: string;
}

export const MobileMenu = ({ className }: MobileMenuProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className={`lg:hidden ${className}`}>
            <Button
                isIconOnly
                variant="light"
                size="lg"
                onPress={onOpen}
                className="text-default-600 hover:text-primary hover:bg-primary-50 transition-all duration-200"
            >
                <span className="text-xl font-bold">☰</span>
            </Button>{' '}
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                placement="left"
                size="sm"
            >
                <DrawerContent>
                    <DrawerHeader className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">StokFlow</h2>
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={onClose}
                        >
                            <CloseIcon className="w-5 h-5" />
                        </Button>
                    </DrawerHeader>

                    <DrawerBody className="p-0">
                        <div className="p-4 space-y-2">
                            <Button
                                as={Link}
                                href="/"
                                variant="light"
                                size="lg"
                                className="w-full justify-start text-default-700"
                                onPress={onClose}
                            >
                                Anasayfa
                            </Button>

                            <Button
                                as={Link}
                                href="/deals"
                                variant="light"
                                size="lg"
                                className="w-full justify-start text-default-700"
                                onPress={onClose}
                            >
                                Fırsatlar
                            </Button>
                        </div>

                        <Divider />

                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-default-500 mb-3 uppercase tracking-wider">
                                Kategoriler
                            </h3>

                            <Accordion variant="splitted" className="p-0">
                                {MOCK_CATEGORIES.map(category => (
                                    <AccordionItem
                                        key={category.id}
                                        title={category.name}
                                        className="text-default-700"
                                    >
                                        <div className="space-y-2 pb-2">
                                            <Link
                                                href={category.href}
                                                className="block text-sm text-primary font-medium hover:text-primary-600"
                                                onPress={onClose}
                                            >
                                                Tümünü Gör
                                            </Link>
                                            {category.subcategories?.map(
                                                subcategory => (
                                                    <Link
                                                        key={subcategory.id}
                                                        href={subcategory.href}
                                                        className="block text-sm text-default-600 hover:text-default-900"
                                                        onPress={onClose}
                                                    >
                                                        {subcategory.name}
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        <Divider />

                        <div className="p-4 space-y-2">
                            <Button
                                as={Link}
                                href="/orders"
                                variant="light"
                                size="lg"
                                className="w-full justify-start text-default-700"
                                onPress={onClose}
                            >
                                <span className="mr-2">🛍️</span>
                                Siparişlerim
                            </Button>

                            <Button
                                as={Link}
                                href="/favorites"
                                variant="light"
                                size="lg"
                                className="w-full justify-start text-default-700"
                                onPress={onClose}
                            >
                                <span className="mr-2">❤️</span>
                                Favorilerim
                            </Button>

                            <Button
                                as={Link}
                                href="/settings"
                                variant="light"
                                size="lg"
                                className="w-full justify-start text-default-700"
                                onPress={onClose}
                            >
                                <span className="mr-2">⚙️</span>
                                Ayarlar
                            </Button>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

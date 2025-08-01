'use client';

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Link,
    Divider,
} from '@heroui/react';
import { ChevronDownIcon } from '@heroui/shared-icons';
import { MOCK_CATEGORIES } from './mock-data';

interface CategoriesNavProps {
    className?: string;
}

export const CategoriesNav = ({ className }: CategoriesNavProps) => {
    return (
        <div className={`hidden lg:flex items-center gap-4 ${className}`}>
            {MOCK_CATEGORIES.map(category => (
                <div key={category.id}>
                    {category.subcategories &&
                    category.subcategories.length > 0 ? (
                        <Dropdown
                            classNames={{
                                content:
                                    'min-w-[280px] p-1 bg-white/95 backdrop-blur-xl border border-default-200 shadow-2xl',
                            }}
                        >
                            <DropdownTrigger>
                                <Button
                                    variant="light"
                                    size="md"
                                    endContent={
                                        <ChevronDownIcon className="w-4 h-4 transition-transform" />
                                    }
                                    className="text-default-700 hover:text-primary hover:bg-primary/10 font-semibold transition-all duration-300 h-12 px-5 group"
                                >
                                    {category.name}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label={`${category.name} kategorileri`}
                                variant="flat"
                                classNames={{
                                    list: 'gap-1',
                                }}
                                items={[
                                    {
                                        key: 'all',
                                        href: category.href,
                                        name: 'Tümünü Gör',
                                        isMain: true,
                                        icon:
                                            category.name === 'Elektronik'
                                                ? '📱'
                                                : category.name === 'Moda'
                                                  ? '👔'
                                                  : category.name ===
                                                      'Ev & Yaşam'
                                                    ? '🏠'
                                                    : category.name ===
                                                        'Spor & Outdoor'
                                                      ? '⚽'
                                                      : category.name ===
                                                          'Kitap & Hobi'
                                                        ? '📚'
                                                        : '📦',
                                    },
                                    { key: 'divider', isDivider: true },
                                    ...category.subcategories.map(sub => ({
                                        key: sub.id,
                                        href: sub.href,
                                        name: sub.name,
                                        isMain: false,
                                    })),
                                ]}
                            >
                                {(item: {
                                    key: string;
                                    href?: string;
                                    name?: string;
                                    isMain?: boolean;
                                    isDivider?: boolean;
                                    icon?: string;
                                }) => {
                                    if (item.isDivider) {
                                        return (
                                            <DropdownItem
                                                key="divider"
                                                className="p-0"
                                            >
                                                <Divider className="my-1" />
                                            </DropdownItem>
                                        );
                                    }

                                    if (item.isMain) {
                                        return (
                                            <DropdownItem
                                                key={item.key}
                                                as={Link}
                                                href={item.href}
                                                className="font-bold text-primary-600 bg-primary/10 rounded-lg mb-2 py-3"
                                                textValue={item.name}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">
                                                        {item.icon}
                                                    </span>
                                                    <div>
                                                        <div className="font-bold">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-default-500">
                                                            {category.name}{' '}
                                                            kategorisindeki tüm
                                                            ürünler
                                                        </div>
                                                    </div>
                                                </div>
                                            </DropdownItem>
                                        );
                                    }

                                    return (
                                        <DropdownItem
                                            key={item.key}
                                            as={Link}
                                            href={item.href}
                                            className="text-default-700 hover:text-primary hover:bg-primary/5 rounded-md py-2 transition-all duration-200"
                                            textValue={item.name}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                                                {item.name}
                                            </div>
                                        </DropdownItem>
                                    );
                                }}
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <Button
                            as={Link}
                            href={category.href}
                            variant="light"
                            size="md"
                            className="text-default-700 hover:text-primary hover:bg-primary/10 font-semibold transition-all duration-300 h-12 px-5 hover:shadow-lg"
                        >
                            {category.name}
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
};

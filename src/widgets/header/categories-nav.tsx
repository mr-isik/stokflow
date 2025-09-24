'use client';

import { useQueryCategories } from '@/entities/category/queries';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Skeleton,
} from '@heroui/react';
import { ChevronDownIcon } from '@heroui/shared-icons';

interface CategoriesNavProps {
    className?: string;
}

export const CategoriesNav = ({ className }: CategoriesNavProps) => {
    const { data: categories, isLoading } = useQueryCategories();

    const visibleCategories = categories?.slice(0, 4) || [];
    const dropdownCategories = categories?.slice(4) || [];

    if (isLoading) {
        return (
            <div className={`hidden lg:flex items-center gap-2 ${className}`}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 rounded-lg">
                        <div className="h-10 w-24 bg-default-200 rounded-lg"></div>
                    </Skeleton>
                ))}
                <Skeleton className="h-10 rounded-lg">
                    <div className="h-10 w-28 bg-default-200 rounded-lg"></div>
                </Skeleton>
            </div>
        );
    }

    return (
        <div className={`hidden lg:flex items-center gap-2 ${className}`}>
            {visibleCategories.map(category => (
                <Button
                    key={category.id}
                    as={Link}
                    href={`/categories/${category.slug}`}
                    variant="light"
                    size="md"
                    className="text-default-700 hover:text-primary hover:bg-primary/10 font-medium transition-all duration-300 h-10 px-4"
                >
                    {category.name}
                </Button>
            ))}

            {dropdownCategories.length > 0 && (
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="light"
                            size="md"
                            endContent={<ChevronDownIcon className="w-4 h-4" />}
                            className="text-default-700 hover:text-primary hover:bg-primary/10 font-medium transition-all duration-300 h-10 px-4"
                        >
                            Daha Fazla
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Diğer kategoriler"
                        className="max-h-60 overflow-y-auto"
                    >
                        {dropdownCategories.map(category => (
                            <DropdownItem
                                key={category.id}
                                as={Link}
                                href={`/products?category=${category.slug}`}
                                className="text-default-700 hover:text-primary"
                            >
                                {category.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
};

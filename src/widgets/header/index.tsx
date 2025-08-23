'use client';

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Badge,
} from '@heroui/react';
import { SearchBar } from './search-bar';
import { CartDropdown } from '../../features/cart/ui/cart-sheet';
import { UserDropdown } from './user-dropdown';
import { CategoriesNav } from './categories-nav';
import { MobileMenu } from './mobile-menu';
import MaxWidthWrapper from '@/shared/ui/max-width-wrapper';

const Header = () => {
    return (
        <div className="w-full border-b border-default-200">
            {/* Top Bar - Hidden on mobile */}
            <div className="hidden lg:block bg-gradient-to-r from-default-50 to-default-100 border-b border-default-200">
                <MaxWidthWrapper className="py-2">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-6 text-default-600">
                            <Link
                                href="/customer-service"
                                className="hover:text-primary text-foreground-500 transition-colors duration-200 flex items-center gap-1 text-sm"
                            >
                                Müşteri Hizmetleri
                            </Link>
                            <Link
                                href="/track-order"
                                className="hover:text-primary text-foreground-500 transition-colors duration-200 flex items-center gap-1 text-sm"
                            >
                                Sipariş Takibi
                            </Link>
                            <Link
                                href="/stores"
                                className="hover:text-primary text-foreground-500 transition-colors duration-200 flex items-center gap-1 text-sm"
                            >
                                Mağazalar
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 text-default-600">
                            <Badge
                                content="Yeni!"
                                color="danger"
                                size="sm"
                                className="animate-pulse"
                            >
                                <Link
                                    href="/deals"
                                    className="hover:text-primary text-foreground-500 transition-colors duration-200 font-medium flex items-center gap-1 text-sm"
                                >
                                    Günün Fırsatları
                                </Link>
                            </Badge>
                            <span className="text-default-300">|</span>
                            <Link
                                href="/help"
                                className="hover:text-primary text-foreground-500 transition-colors duration-200 text-sm"
                            >
                                Yardım
                            </Link>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </div>

            {/* Main Header */}
            <Navbar
                maxWidth="2xl"
                className="bg-white/98 backdrop-blur-md border-b border-default-200"
                height="80px"
                isBordered={false}
            >
                {/* Mobile Layout */}
                <div className="lg:hidden flex items-center justify-between w-full">
                    {/* Mobile Left: Menu + Logo */}
                    <div className="flex items-center gap-3">
                        <MobileMenu />
                        <Link
                            href="/"
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                    S
                                </span>
                            </div>
                            <span className="font-bold text-lg text-default-900 hidden xs:block">
                                StokFlow
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Right: Cart + User */}
                    <div className="flex items-center gap-2">
                        <CartDropdown />
                        <UserDropdown />
                    </div>
                </div>

                {/* Desktop Layout */}
                <MaxWidthWrapper className="hidden lg:flex items-center justify-between w-full">
                    {/* Desktop Logo */}
                    <NavbarBrand className="flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">
                                    S
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-xl text-default-900 block leading-tight">
                                    StokFlow
                                </span>
                                <span className="text-xs text-default-500 block">
                                    E-ticaret
                                </span>
                            </div>
                        </Link>
                    </NavbarBrand>

                    {/* Desktop Search Bar - Center */}
                    <NavbarContent
                        justify="center"
                        className="flex-1 max-w-2xl min-w-0 mx-6"
                    >
                        <NavbarItem className="w-full">
                            <SearchBar className="w-full" />
                        </NavbarItem>
                    </NavbarContent>

                    {/* Desktop Right Actions */}
                    <NavbarContent justify="end" className="flex-shrink-0">
                        <NavbarItem>
                            <CartDropdown />
                        </NavbarItem>
                        <NavbarItem>
                            <UserDropdown />
                        </NavbarItem>
                    </NavbarContent>
                </MaxWidthWrapper>
            </Navbar>

            {/* Mobile Search Bar - Separate Row */}
            <div className="lg:hidden bg-white border-b border-default-100 px-4 py-3">
                <SearchBar className="w-full" />
            </div>

            {/* Categories Navigation - Desktop Only */}
            <div className="hidden lg:block bg-gradient-to-r from-white via-primary-50/30 to-white border-t border-default-100">
                <MaxWidthWrapper>
                    <div className="flex items-center justify-center py-3">
                        <CategoriesNav />
                    </div>
                </MaxWidthWrapper>
            </div>
        </div>
    );
};

export default Header;

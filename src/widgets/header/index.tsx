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
import { CartDropdown } from './cart-dropdown';
import { UserDropdown } from './user-dropdown';
import { CategoriesNav } from './categories-nav';
import { MobileMenu } from './mobile-menu';

const Header = () => {
    return (
        <div className="w-full border-b border-default-200">
            {/* Top Bar - Hidden on mobile */}
            <div className="hidden lg:block bg-gradient-to-r from-default-50 to-default-100 border-b border-default-200">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-6 text-default-600">
                            <Link
                                href="/customer-service"
                                className="hover:text-primary transition-colors duration-200 flex items-center gap-1 text-sm"
                            >
                                <span>📞</span>
                                Müşteri Hizmetleri
                            </Link>
                            <Link
                                href="/track-order"
                                className="hover:text-primary transition-colors duration-200 flex items-center gap-1 text-sm"
                            >
                                <span>📦</span>
                                Sipariş Takibi
                            </Link>
                            <Link
                                href="/stores"
                                className="hover:text-primary transition-colors duration-200 flex items-center gap-1 text-sm"
                            >
                                <span>🏪</span>
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
                                    className="hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1 text-sm"
                                >
                                    🔥 Günün Fırsatları
                                </Link>
                            </Badge>
                            <span className="text-default-300">|</span>
                            <Link
                                href="/help"
                                className="hover:text-primary transition-colors duration-200 text-sm"
                            >
                                Yardım
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <Navbar
                maxWidth="2xl"
                className="bg-white/98 backdrop-blur-md shadow-sm border-b border-default-100"
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
                <div className="hidden lg:flex items-center justify-between w-full">
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
                </div>
            </Navbar>

            {/* Mobile Search Bar - Separate Row */}
            <div className="lg:hidden bg-white border-b border-default-100 px-4 py-3">
                <SearchBar className="w-full" />
            </div>

            {/* Categories Navigation - Desktop Only */}
            <div className="hidden lg:block bg-gradient-to-r from-white via-primary-50/30 to-white border-t border-default-100 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <CategoriesNav />

                        <div className="flex items-center gap-6 text-sm text-default-600">
                            <Link
                                href="/new-arrivals"
                                className="hover:text-primary transition-colors duration-200 font-medium flex items-center gap-2 text-sm bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-full border border-yellow-200 hover:border-yellow-300 hover:shadow-lg"
                            >
                                <span className="text-base">✨</span>
                                Yeni Gelenler
                            </Link>
                            <Link
                                href="/best-sellers"
                                className="hover:text-primary transition-colors duration-200 font-medium flex items-center gap-2 text-sm bg-gradient-to-r from-red-50 to-orange-50 px-3 py-2 rounded-full border border-red-200 hover:border-red-300 hover:shadow-lg"
                            >
                                <span className="text-base">🔥</span>
                                Çok Satanlar
                            </Link>
                            <Link
                                href="/brands"
                                className="hover:text-primary transition-colors duration-200 font-medium flex items-center gap-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-full border border-blue-200 hover:border-blue-300 hover:shadow-lg"
                            >
                                <span className="text-base">🏷️</span>
                                Markalar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

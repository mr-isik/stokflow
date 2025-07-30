'use client';

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Button,
    Avatar,
    Link,
} from '@heroui/react';
import { useState } from 'react';
import { User } from './types';

interface UserDropdownProps {
    className?: string;
}

// Mock user - in real app this would come from auth context
const MOCK_USER: User = {
    id: '1',
    name: 'Ömer Faruk İşik',
    email: 'omer@example.com',
    avatar: '/api/placeholder/40/40',
};

export const UserDropdown = ({ className }: UserDropdownProps) => {
    const [user, setUser] = useState<User | null>(MOCK_USER); // null = not logged in

    const handleLogout = () => {
        setUser(null);
        // Handle logout logic
    };

    if (!user) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <Button
                    as={Link}
                    href="/login"
                    variant="light"
                    size="sm"
                    className="text-default-700 hover:text-primary hover:bg-primary-50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
                >
                    <span className="hidden xs:block">Giriş Yap</span>
                    <span className="xs:hidden">Giriş</span>
                </Button>
                <Button
                    as={Link}
                    href="/signup"
                    color="primary"
                    size="sm"
                    className="shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
                >
                    <span className="hidden xs:block">Kayıt Ol</span>
                    <span className="xs:hidden">Kayıt</span>
                </Button>
            </div>
        );
    }

    return (
        <div className={className}>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button
                        variant="light"
                        className="flex items-center gap-3 h-auto p-2 hover:bg-default-100 transition-colors duration-200"
                    >
                        <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="sm"
                            className="w-9 h-9 ring-2 ring-default-200"
                        />
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-default-900">
                                {user.name.split(' ')[0]}
                            </p>
                            <p className="text-xs text-default-500">Hesabım</p>
                        </div>
                    </Button>
                </DropdownTrigger>

                <DropdownMenu
                    aria-label="Kullanıcı menüsü"
                    variant="faded"
                    className="w-64"
                >
                    <DropdownSection title="Hesap" showDivider>
                        <DropdownItem
                            key="profile"
                            startContent={<span className="text-sm">👤</span>}
                            as={Link}
                            href="/profile"
                        >
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-default-500">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title="Alışveriş" showDivider>
                        <DropdownItem
                            key="orders"
                            startContent={<span className="text-sm">🛍️</span>}
                            as={Link}
                            href="/orders"
                        >
                            Siparişlerim
                        </DropdownItem>
                        <DropdownItem
                            key="favorites"
                            startContent={<span className="text-sm">❤️</span>}
                            as={Link}
                            href="/favorites"
                        >
                            Favorilerim
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title="Ayarlar">
                        <DropdownItem
                            key="settings"
                            startContent={<span className="text-sm">⚙️</span>}
                            as={Link}
                            href="/settings"
                        >
                            Hesap Ayarları
                        </DropdownItem>
                        <DropdownItem
                            key="logout"
                            startContent={<span className="text-sm">🚪</span>}
                            color="danger"
                            onPress={handleLogout}
                        >
                            Çıkış Yap
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

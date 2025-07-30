import { Category, CartItem } from './types';

export const MOCK_CATEGORIES: Category[] = [
    {
        id: '1',
        name: 'Elektronik',
        href: '/categories/elektronik',
        subcategories: [
            {
                id: '1-1',
                name: 'Telefon & Tablet',
                href: '/categories/elektronik/telefon-tablet',
            },
            {
                id: '1-2',
                name: 'Bilgisayar',
                href: '/categories/elektronik/bilgisayar',
            },
            {
                id: '1-3',
                name: 'TV & Ses Sistemleri',
                href: '/categories/elektronik/tv-ses',
            },
            {
                id: '1-4',
                name: 'Oyun Konsolları',
                href: '/categories/elektronik/oyun',
            },
        ],
    },
    {
        id: '2',
        name: 'Moda',
        href: '/categories/moda',
        subcategories: [
            { id: '2-1', name: 'Kadın Giyim', href: '/categories/moda/kadin' },
            { id: '2-2', name: 'Erkek Giyim', href: '/categories/moda/erkek' },
            { id: '2-3', name: 'Ayakkabı', href: '/categories/moda/ayakkabi' },
            { id: '2-4', name: 'Aksesuar', href: '/categories/moda/aksesuar' },
        ],
    },
    {
        id: '3',
        name: 'Ev & Yaşam',
        href: '/categories/ev-yasam',
        subcategories: [
            {
                id: '3-1',
                name: 'Mobilya',
                href: '/categories/ev-yasam/mobilya',
            },
            {
                id: '3-2',
                name: 'Ev Dekorasyonu',
                href: '/categories/ev-yasam/dekorasyon',
            },
            { id: '3-3', name: 'Mutfak', href: '/categories/ev-yasam/mutfak' },
            { id: '3-4', name: 'Bahçe', href: '/categories/ev-yasam/bahce' },
        ],
    },
    {
        id: '4',
        name: 'Spor & Outdoor',
        href: '/categories/spor',
        subcategories: [
            { id: '4-1', name: 'Fitness', href: '/categories/spor/fitness' },
            { id: '4-2', name: 'Futbol', href: '/categories/spor/futbol' },
            { id: '4-3', name: 'Koşu', href: '/categories/spor/kosu' },
            { id: '4-4', name: 'Outdoor', href: '/categories/spor/outdoor' },
        ],
    },
    {
        id: '5',
        name: 'Kitap & Hobi',
        href: '/categories/kitap-hobi',
        subcategories: [
            {
                id: '5-1',
                name: 'Kitaplar',
                href: '/categories/kitap-hobi/kitaplar',
            },
            { id: '5-2', name: 'Müzik', href: '/categories/kitap-hobi/muzik' },
            { id: '5-3', name: 'Film', href: '/categories/kitap-hobi/film' },
            {
                id: '5-4',
                name: 'Oyuncak',
                href: '/categories/kitap-hobi/oyuncak',
            },
        ],
    },
];

export const MOCK_CART_ITEMS: CartItem[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro',
        price: 45999,
        quantity: 1,
        image: '/api/placeholder/60/60',
    },
    {
        id: '2',
        name: 'MacBook Air M3',
        price: 35999,
        quantity: 1,
        image: '/api/placeholder/60/60',
    },
    {
        id: '3',
        name: 'AirPods Pro',
        price: 8999,
        quantity: 2,
        image: '/api/placeholder/60/60',
    },
];

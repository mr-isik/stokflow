import type { Product } from '../model';

export const mockProductDetail: Product = {
    id: 1,
    title: 'Premium Deri Ayakkabı - Klasik Erkek Oxford',
    slug: 'premium-deri-ayakkabi-klasik-erkek-oxford',
    product_images: [
        {
            url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
            alt: 'Siyah deri Oxford ayakkabı ön görünüm',
            is_featured: true,
        },
        {
            url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
            alt: 'Ayakkabı yan profil görünümü',
            is_featured: false,
        },
        {
            url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
            alt: 'Ayakkabı taban detayı',
            is_featured: false,
        },
        {
            url: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&h=800&fit=crop',
            alt: 'Ayakkabı iç detay görünümü',
            is_featured: false,
        },
        {
            url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop',
            alt: 'Ayakkabı dikişleri ve malzeme detayı',
            is_featured: false,
        },
    ],
    product_variants: [
        {
            price: 299.99,
        },
        {
            price: 349.99,
        },
        {
            price: 399.99,
        },
    ],
};

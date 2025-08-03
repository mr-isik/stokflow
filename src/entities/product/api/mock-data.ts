import type { Product } from '../model';

export const mockProductDetail: Product = {
    id: 1,
    title: 'Premium Deri Ayakkabı - Klasik Erkek Oxford',
    slug: 'premium-deri-ayakkabi-klasik-erkek-oxford',
    description: `Bu premium kalite deri ayakkabı, modern erkeklerin klasik tarzını yansıtan mükemmel bir seçim. 

Özenle seçilmiş gerçek deri malzemeden üretilen bu Oxford model, hem günlük kullanım hem de özel günler için ideal. Rahat iç astarı ve ergonomik tasarımı sayesinde tüm gün konfor sağlar.

Klasik siyah rengi ile her kıyafetle uyum sağlayan bu ayakkabı, iş hayatından sosyal etkinliklere kadar her ortamda şıklığınızı tamamlar. Dayanıklı yapısı ve zamansız tasarımı ile yıllarca kullanabileceğiniz kaliteli bir yatırım.`,
    brand: 'Premium Leather Co.',
    category: 'Ayakkabı',
    features: [
        '100% Gerçek deri üretim',
        'Nefes alabilen iç astar',
        'Anti-slip taban teknolojisi',
        'Ergonomik ayak desteği',
        'Su geçirmez koruma',
        'El yapımı dikişler',
        'Klasik Oxford tasarım',
        'Dayanıklı malzeme kalitesi',
    ],
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
            id: 1,
            price: 899,
            size: '40',
            color: 'Siyah',
            stock: 15,
            sku: 'PLO-BLK-40',
        },
        {
            id: 2,
            price: 899,
            size: '41',
            color: 'Siyah',
            stock: 12,
            sku: 'PLO-BLK-41',
        },
        {
            id: 3,
            price: 899,
            size: '42',
            color: 'Siyah',
            stock: 8,
            sku: 'PLO-BLK-42',
        },
        {
            id: 4,
            price: 899,
            size: '43',
            color: 'Siyah',
            stock: 5,
            sku: 'PLO-BLK-43',
        },
        {
            id: 5,
            price: 899,
            size: '44',
            color: 'Siyah',
            stock: 3,
            sku: 'PLO-BLK-44',
        },
        {
            id: 6,
            price: 949,
            size: '40',
            color: 'Kahverengi',
            stock: 10,
            sku: 'PLO-BRN-40',
        },
        {
            id: 7,
            price: 949,
            size: '41',
            color: 'Kahverengi',
            stock: 7,
            sku: 'PLO-BRN-41',
        },
        {
            id: 8,
            price: 949,
            size: '42',
            color: 'Kahverengi',
            stock: 9,
            sku: 'PLO-BRN-42',
        },
        {
            id: 9,
            price: 949,
            size: '43',
            color: 'Kahverengi',
            stock: 0,
            sku: 'PLO-BRN-43',
        },
        {
            id: 10,
            price: 949,
            size: '44',
            color: 'Kahverengi',
            stock: 2,
            sku: 'PLO-BRN-44',
        },
    ],
    reviews: [
        {
            id: 1,
            user_name: 'Ahmet Yılmaz',
            rating: 5,
            comment:
                'Muhteşem kalite! Aldığımdan beri her gün giyiyorum. Çok rahat ve şık. Kesinlikle tavsiye ederim.',
            created_at: '2024-07-15T10:30:00Z',
            helpful_count: 12,
        },
        {
            id: 2,
            user_name: 'Mehmet Özkan',
            rating: 4,
            comment:
                'Kaliteli bir ürün. Sadece başlangıçta biraz sert geldi, ama zamanla yumuşadı. Fiyat performans olarak iyi.',
            created_at: '2024-07-10T14:22:00Z',
            helpful_count: 8,
        },
        {
            id: 3,
            user_name: 'Can Demir',
            rating: 5,
            comment:
                'İş hayatımda sürekli kullanıyorum. Hem rahat hem de çok şık duruyor. Kalitesi gerçekten premium.',
            created_at: '2024-07-05T09:15:00Z',
            helpful_count: 15,
        },
        {
            id: 4,
            user_name: 'Emre Kaya',
            rating: 4,
            comment:
                'Güzel bir ayakkabı. Kahverengi modelini aldım, çok beğendim. Sadece fiyatı biraz yüksek geldi.',
            created_at: '2024-06-28T16:45:00Z',
            helpful_count: 6,
        },
        {
            id: 5,
            user_name: 'Burak Aslan',
            rating: 5,
            comment:
                'Mükemmel işçilik! Dikişleri çok düzgün, malzemesi kaliteli. Bu fiyata böyle bir ürün bulmak zor.',
            created_at: '2024-06-25T11:30:00Z',
            helpful_count: 20,
        },
        {
            id: 6,
            user_name: 'Oğuz Çelik',
            rating: 3,
            comment:
                'Ortalama bir ürün. Beklentilerimi tam karşılamadı. Fiyatına göre daha iyi olabilirdi.',
            created_at: '2024-06-20T13:12:00Z',
            helpful_count: 3,
        },
        {
            id: 7,
            user_name: 'Serkan Yıldız',
            rating: 5,
            comment:
                'Harika! Ayağıma çok iyi oturdu. Uzun süre yürürken bile rahatsızlık yaşamıyorum.',
            created_at: '2024-06-15T08:20:00Z',
            helpful_count: 9,
        },
    ],
    average_rating: 4.4,
    total_reviews: 7,
};

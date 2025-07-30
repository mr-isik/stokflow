export interface Category {
    id: string;
    name: string;
    href: string;
    subcategories?: Subcategory[];
}

export interface Subcategory {
    id: string;
    name: string;
    href: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface SearchResult {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: string;
}

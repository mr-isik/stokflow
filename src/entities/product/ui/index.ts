// Export all product UI components
export { ProductCard } from './product-card';
export type {
    ProductCardProps,
    ProductImageProps,
    ProductPriceProps,
    ProductActionsProps,
} from './product-card';

// Re-export product types
export type {
    Product,
    ProductsResponse,
    PaginatedProductsResponse,
} from '../model';

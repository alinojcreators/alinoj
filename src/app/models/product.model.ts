export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    brand: string;
    category: string;
    subCategory?: string;
    tags: string[];
    sku: string;
    costPrice: number;
    sellingPrice: number;
    price: number;
    image: string;
    stock: number;
    reorderLevel: number;
    taxRate: number;
    currency?: string;
    onSale?: boolean;
    rating?: number;
    reviews?: number;
    hasVariants?: boolean;
    variants?: Array<{
        id: string;
        sku: string;
        size?: string;
        color?: string;
        material?: string;
        weight?: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
            unit: string;
        };
        stock: number;
        price: number;
    }>;
    media?: Array<{
        type: 'image' | 'video';
        url: string;
        alt?: string;
        isPrimary?: boolean;
    }>;
    specifications?: Array<{
        name: string;
        value: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}
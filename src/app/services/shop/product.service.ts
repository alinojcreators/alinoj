import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ProductVariant {
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
}

export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductShipping {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  class: 'free' | 'standard' | 'expedited';
  locations: string[];
  cost?: number;
}

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
  variants?: ProductVariant[];
  media?: ProductMedia[];
  specifications?: ProductSpecification[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  brands?: string[];
  sortBy?: 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductRating {
  userId: string;
  rating: number;
  comment?: string;
  images?: { url: string; caption: string; }[];
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<ProductResponse>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0
  });

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProducts(filter: ProductFilter = {}): Observable<ProductResponse> {
    let params = new HttpParams();

    if (filter.search) params = params.set('search', filter.search);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.tags) params = params.set('tags', filter.tags.join(','));
    if (filter.brands) params = params.set('brands', filter.brands.join(','));
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());

    return this.http.get<ProductResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        response.items = response.items.map(product => ({
          ...product,
          image: this.getFullImageUrl(product.image)
        }));
        console.log('Products with transformed image URLs:', response.items);
        this.productsSubject.next(response);
        return response;
      })
    );
  }

  private getFullImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) return 'assets/placeholder-image.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('assets/')) return imageUrl;
    return `${environment.baseUrl}${imageUrl}`;
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(category: string, filter: Partial<ProductFilter> = {}): Observable<ProductResponse> {
    return this.getProducts({ ...filter, category });
  }

  searchProducts(query: string, filter: Partial<ProductFilter> = {}): Observable<ProductResponse> {
    return this.getProducts({ ...filter, search: query });
  }

  getCurrentProducts(): Observable<ProductResponse> {
    return this.productsSubject.asObservable();
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/brands`);
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tags`);
  }

  createProduct(product: FormData | Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      map(product => ({
        ...product,
        image: this.getFullImageUrl(product.image)
      })),
      tap(() => this.refreshProducts())
    );
  }

  updateProduct(id: string, product: FormData | Partial<Product>): Observable<Product> {
    const productId = id || (product as Product)._id || (product as Product).id;
    if (!productId) {
      throw new Error('Product ID is required for update');
    }
    
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, product).pipe(
      map(product => ({
        ...product,
        image: this.getFullImageUrl(product.image)
      })),
      tap(() => this.refreshProducts())
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Product deleted:', id);
        this.refreshProducts();
      })
    );
  }

  rateProduct(productId: string, rating: number, comment?: string, images?: { url: string; caption: string; }[]) {
    return this.http.post<any>(`${this.apiUrl}/products/${productId}/rate`, {
      rating,
      comment,
      images
    });
  }

  getProductReviews(productId: string) {
    return this.http.get<any>(`${this.apiUrl}/products/${productId}`).pipe(
      map(product => product.userRatings)
    );
  }

  private refreshProducts() {
    console.log('Refreshing products...');
    const currentValue = this.productsSubject.value;
    this.getProducts({
      page: currentValue.page,
      pageSize: currentValue.pageSize
    }).subscribe(
      response => console.log('Products refreshed:', response),
      error => console.error('Error refreshing products:', error)
    );
  }
}
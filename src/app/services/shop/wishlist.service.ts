import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from './product.service';
import { tap, catchError } from 'rxjs/operators';

export interface WishlistShare {
  email: string;
  accessLevel: 'view' | 'edit';
}

export interface SharedWishlist {
  _id: string;
  userId: string;
  name: string;
  items: Product[];
  shareCode: string;
  isPublic: boolean;
  sharedWith: WishlistShare[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  private wishlistItems = new BehaviorSubject<Product[]>([]);

  constructor(
    private http: HttpClient
  ) {
    this.loadWishlist();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  private getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.userId || tokenPayload._id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.status === 401) {
      return throwError(() => ({ status: 401, message: 'Please authenticate' }));
    }
    return throwError(() => error);
  }

  private loadWishlist() {
    const userId = this.getUserId();
    if (userId) {
      this.http.get<Product[]>(`${this.apiUrl}`, this.getAuthHeaders())
        .pipe(
          catchError(error => {
            console.error('Error loading wishlist:', error);
            return of([]);
          })
        )
        .subscribe(items => {
          this.wishlistItems.next(items || []);
        });
    } else {
      this.wishlistItems.next([]);
    }
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistItems.asObservable();
  }

  addToWishlist(product: Product): Observable<Product[]> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => ({ status: 401, message: 'Please authenticate' }));
    }

    const productId = product._id || product.id;
    if (!productId) {
      return throwError(() => ({ status: 400, message: 'Invalid product ID' }));
    }

    // Optimistic update
    const currentItems = this.wishlistItems.getValue();
    const updatedItems = [...currentItems, product];
    this.wishlistItems.next(updatedItems);

    return this.http.post<Product[]>(
      `${this.apiUrl}/add`,
      { productId },
      this.getAuthHeaders()
    ).pipe(
      tap(items => {
        this.wishlistItems.next(items);
      }),
      catchError(error => {
        // Revert optimistic update on error
        this.wishlistItems.next(currentItems);
        return this.handleError(error);
      })
    );
  }

  removeFromWishlist(productId: string): Observable<Product[]> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => ({ status: 401, message: 'Please authenticate' }));
    }

    if (!productId) {
      return throwError(() => ({ status: 400, message: 'Invalid product ID' }));
    }

    // Optimistic update
    const currentItems = this.wishlistItems.getValue();
    const updatedItems = currentItems.filter(item => 
      (item._id !== productId && item.id !== productId)
    );
    this.wishlistItems.next(updatedItems);

    return this.http.delete<Product[]>(
      `${this.apiUrl}/remove/${productId}`,
      this.getAuthHeaders()
    ).pipe(
      tap(items => {
        this.wishlistItems.next(items);
      }),
      catchError(error => {
        // Revert optimistic update on error
        this.wishlistItems.next(currentItems);
        return this.handleError(error);
      })
    );
  }

  // New methods for sharing and transferring to cart
  shareWishlist(emails: string[], accessLevel: 'view' | 'edit' = 'view'): Observable<{ shareCode: string; sharedWith: WishlistShare[] }> {
    return this.http.post<{ shareCode: string; sharedWith: WishlistShare[] }>(
      `${this.apiUrl}/share`,
      { emails, accessLevel },
      this.getAuthHeaders()
    ).pipe(
      catchError(this.handleError)
    );
  }

  getSharedWishlist(shareCode: string): Observable<SharedWishlist> {
    return this.http.get<SharedWishlist>(
      `${this.apiUrl}/shared/${shareCode}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  transferToCart(items: string[]): Observable<{ message: string; remainingItems: Product[] }> {
    return this.http.post<{ message: string; remainingItems: Product[] }>(
      `${this.apiUrl}/transfer-to-cart`,
      { items },
      this.getAuthHeaders()
    ).pipe(
      tap(response => {
        // Update local wishlist items after transfer
        this.wishlistItems.next(response.remainingItems);
      }),
      catchError(this.handleError)
    );
  }

  isInWishlist(productId: string): boolean {
    const items = this.wishlistItems.getValue();
    return items.some(item => (item._id === productId || item.id === productId));
  }
}
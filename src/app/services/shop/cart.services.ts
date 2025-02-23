import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from './product.service';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartTotal = new BehaviorSubject<number>(0);
  private authSubscription: Subscription;
  private cartUpdateInterval: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Subscribe to auth changes to load cart when user logs in
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.loadCart();
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
        this.cartItems.next([]);
        this.cartTotal.next(0);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    this.stopAutoRefresh();
  }

  private startAutoRefresh() {
    // Refresh cart every 30 seconds
    this.cartUpdateInterval = setInterval(() => {
      this.loadCart();
    }, 30000);
  }

  private stopAutoRefresh() {
    if (this.cartUpdateInterval) {
      clearInterval(this.cartUpdateInterval);
    }
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

  private loadCart() {
    return this.http.get<CartItem[]>(this.apiUrl, this.getAuthHeaders())
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            console.error('Unauthorized access:', error);
            localStorage.removeItem('token'); // Clear invalid token
            return of([]);
          }
          console.error('Error loading cart:', error);
          return of([]);
        })
      )
      .subscribe(items => {
        this.cartItems.next(items);
        this.updateCartTotal();
      });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  private updateCartTotal() {
    const total = this.cartItems.getValue().reduce((sum, item) => {
      if (!item?.product) return sum;
      const price = item.product.sellingPrice || item.product.price || 0;
      return sum + (price * (item.quantity || 0));
    }, 0);
    this.cartTotal.next(total);
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): Observable<CartItem[]> {
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product has no ID:', product);
      throw new Error('Invalid product ID');
    }
    
    return this.http.post<CartItem[]>(`${this.apiUrl}/add`, { 
      productId: productId.toString(), 
      quantity 
    }, this.getAuthHeaders())
    .pipe(
      tap(items => {
        this.cartItems.next(items);
        this.updateCartTotal();
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        throw error;
      })
    );
  }

  removeFromCart(productId: string): Observable<CartItem[]> {
    if (!productId) {
      console.error('Invalid product ID');
      throw new Error('Invalid product ID');
    }

    return this.http.delete<CartItem[]>(`${this.apiUrl}/remove/${productId.toString()}`, this.getAuthHeaders())
      .pipe(
        tap(items => {
          this.cartItems.next(items);
          this.updateCartTotal();
        }),
        catchError(error => {
          console.error('Error removing from cart:', error);
          throw error;
        })
      );
  }

  updateQuantity(productId: string, quantity: number): Observable<CartItem[]> {
    if (!productId) {
      console.error('Invalid product ID');
      throw new Error('Invalid product ID');
    }

    return this.http.put<CartItem[]>(`${this.apiUrl}/update`, { 
      productId: productId.toString(), 
      quantity 
    }, this.getAuthHeaders())
    .pipe(
      tap(items => {
        this.cartItems.next(items);
        this.updateCartTotal();
      }),
      catchError(error => {
        console.error('Error updating quantity:', error);
        throw error;
      })
    );
  }
}
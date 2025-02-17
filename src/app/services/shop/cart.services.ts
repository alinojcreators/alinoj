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
    const userId = this.getUserId();
    if (userId) {
      this.http.get<CartItem[]>(`${this.apiUrl}`, this.getAuthHeaders())
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
          this.cartItems.next(items || []);
          this.updateCartTotal();
        });
    } else {
      this.cartItems.next([]);
      this.cartTotal.next(0);
    }
  }

  private updateCartTotal() {
    const total = this.calculateTotal();
    this.cartTotal.next(total);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartItems.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  private calculateTotal() {
    const items = this.cartItems.getValue();
    return items.reduce((sum, item) => {
      const price = item.product.sellingPrice || item.product.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): Observable<CartItem[]> {
    const userId = this.getUserId();
    if (!userId) {
      return new Observable(subscriber => {
        subscriber.error({ status: 401, message: 'Please authenticate' });
      });
    }

    const productId = product._id || product.id;
    if (!productId) {
      return new Observable(subscriber => {
        subscriber.error({ status: 400, message: 'Invalid product ID' });
      });
    }

    // Optimistic update
    const currentItems = this.cartItems.getValue();
    const updatedItems = [...currentItems];
    const existingItemIndex = updatedItems.findIndex(item => 
      (item.product._id === productId || item.product.id === productId)
    );

    if (existingItemIndex > -1) {
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      updatedItems.push({ product, quantity });
    }

    this.cartItems.next(updatedItems);
    this.updateCartTotal();

    return this.http.post<CartItem[]>(
      `${this.apiUrl}/add`,
      { productId, quantity },
      this.getAuthHeaders()
    ).pipe(
      tap(items => {
        this.cartItems.next(items);
        this.updateCartTotal();
      }),
      catchError(error => {
        // Revert optimistic update on error
        this.cartItems.next(currentItems);
        this.updateCartTotal();
        throw error;
      })
    );
  }

  removeFromCart(productId: string): Observable<CartItem[]> {
    const userId = this.getUserId();
    if (!userId) {
      return new Observable(subscriber => {
        subscriber.error({ status: 401, message: 'Please authenticate' });
      });
    }

    if (!productId) {
      return new Observable(subscriber => {
        subscriber.error({ status: 400, message: 'Invalid product ID' });
      });
    }

    // Optimistic update
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(item => 
      item.product._id !== productId && item.product.id !== productId
    );

    this.cartItems.next(updatedItems);
    this.updateCartTotal();

    return this.http.delete<CartItem[]>(
      `${this.apiUrl}/remove/${productId}`,
      this.getAuthHeaders()
    ).pipe(
      tap(items => {
        this.cartItems.next(items);
        this.updateCartTotal();
      }),
      catchError(error => {
        // Revert optimistic update on error
        this.cartItems.next(currentItems);
        this.updateCartTotal();
        throw error;
      })
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<CartItem[]> {
    console.log(productId, "productId");
    const userId = this.getUserId();
    if (!userId) {
      return new Observable(subscriber => {
        subscriber.error({ status: 401, message: 'Please authenticate' });
      });
    }

    if (!productId) {
      return new Observable(subscriber => {
        subscriber.error({ status: 400, message: 'Invalid product ID' });
      });
    }

    // Optimistic update
    const currentItems = this.cartItems.getValue();
    const updatedItems = [...currentItems];
    const existingItemIndex = updatedItems.findIndex(item => 
      (item.product._id === productId || item.product.id === productId)
    );

    if (existingItemIndex === -1) {
      return new Observable(subscriber => {
        subscriber.error({ status: 404, message: 'Product not found in cart' });
      });
    }

    const item = updatedItems[existingItemIndex];
    if (quantity > (item.product.stock || 0)) {
      return new Observable(subscriber => {
        subscriber.error({ status: 400, message: 'Not enough stock available' });
      });
    }

    // Apply optimistic update
    updatedItems[existingItemIndex].quantity = quantity;
    this.cartItems.next(updatedItems);
    this.updateCartTotal();

    return this.http.put<CartItem[]>(
      `${this.apiUrl}/update`,
      { productId, quantity },
      this.getAuthHeaders()
    ).pipe(
      tap(items => {
        this.cartItems.next(items);
        this.updateCartTotal();
      }),
      catchError(error => {
        // Revert optimistic update on error
        this.cartItems.next(currentItems);
        this.updateCartTotal();
        throw error;
      })
    );
  }
}
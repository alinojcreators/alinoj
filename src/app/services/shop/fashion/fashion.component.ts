import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../../services/shop/product.service';
import { CartService } from '../../../services/shop/cart.services';
import { WishlistService } from '../../../services/shop/wishlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="fashion-container">
      <h1>Fashion</h1>
      <div class="products-grid">
        <mat-card *ngFor="let product of products" class="product-card">
          <img mat-card-image [src]="product.image" [alt]="product.name">
          <mat-card-content>
            <h2>{{product.name}}</h2>
            <p class="price">₹{{product.price}}</p>
            <div class="rating">
              <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                       [class.filled]="star <= product.rating">
                star
              </mat-icon>
              <span>({{product.reviews || 0}})</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="addToCart(product)" [disabled]="!product.stock">
              <mat-icon>shopping_cart</mat-icon> Add to Cart
            </button>
            <button mat-icon-button color="accent" (click)="toggleWishlist(product)">
              <mat-icon>{{isInWishlist(product) ? 'favorite' : 'favorite_border'}}</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .fashion-container {
      padding: 20px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }
    
    .product-card {
      img {
        height: 200px;
        object-fit: cover;
      }
      
      .price {
        font-size: 1.2em;
        font-weight: bold;
        color: #2196f3;
      }
      
      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        
        mat-icon {
          color: #ccc;
          font-size: 20px;
          width: 20px;
          height: 20px;
          
          &.filled {
            color: #ffd700;
          }
        }
      }
    }
  `]
})
export class FashionComponent implements OnInit {
  products: Product[] = [];
  wishlistItems: Set<string> = new Set();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadWishlist();
  }

  loadProducts() {
    this.productService.getProductsByCategory('fashion').subscribe(
      response => {
        this.products = response.items;
      }
    );
  }

  loadWishlist() {
    this.wishlistService.getWishlistItems().subscribe(
      items => {
        this.wishlistItems = new Set(items.map(item => item.id || ''));
      }
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product).subscribe(
      (response) => {
        this.snackBar.open('Added to cart successfully', 'Close', {
          duration: 3000
        });
      },
      (error) => {
        if (error.status === 401) {
          this.snackBar.open('Please login to add items to cart', 'Login', {
            duration: 5000
          }).onAction().subscribe(() => {
            // Store the current URL to redirect back after login
            localStorage.setItem('redirectUrl', window.location.pathname);
            this.router.navigate(['/login']);
          });
        } else {
          this.snackBar.open('Failed to add to cart', 'Close', {
            duration: 3000
          });
        }
      }
    );
  }

  toggleWishlist(product: Product) {
    const productId = product._id || product.id;
    if (!productId) {
      this.snackBar.open('Invalid product', 'Close', {
        duration: 3000
      });
      return;
    }

    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistItems.delete(productId);
          this.snackBar.open('Removed from wishlist', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          if (error.status === 401) {
            this.snackBar.open('Please login to manage wishlist', 'Login', {
              duration: 5000
            }).onAction().subscribe(() => {
              localStorage.setItem('redirectUrl', window.location.pathname);
              this.router.navigate(['/login']);
            });
          } else {
            this.snackBar.open(error.message || 'Failed to remove from wishlist', 'Close', {
              duration: 3000
            });
          }
        }
      });
    } else {
      this.wishlistService.addToWishlist(product).subscribe({
        next: () => {
          this.wishlistItems.add(productId);
          this.snackBar.open('Added to wishlist', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          if (error.status === 401) {
            this.snackBar.open('Please login to manage wishlist', 'Login', {
              duration: 5000
            }).onAction().subscribe(() => {
              localStorage.setItem('redirectUrl', window.location.pathname);
              this.router.navigate(['/login']);
            });
          } else {
            this.snackBar.open(error.message || 'Failed to add to wishlist', 'Close', {
              duration: 3000
            });
          }
        }
      });
    }
  }

  isInWishlist(product: Product): boolean {
    const productId = product._id || product.id;
    return productId ? this.wishlistItems.has(productId) : false;
  }
}
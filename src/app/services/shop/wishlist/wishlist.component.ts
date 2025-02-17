import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WishlistService, SharedWishlist } from '../../../services/shop/wishlist.service';
import { CartService } from '../../../services/shop/cart.services';
import { ProductService } from '../../../services/shop/product.service';
import { Product } from '../../../services/shop/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="wishlist-container">
      <h1>My Wishlist</h1>
      
      <div class="wishlist-actions" *ngIf="items.length > 0">
        <button mat-raised-button color="primary" (click)="shareWishlist()">
          <mat-icon>share</mat-icon>
          Share Wishlist
        </button>
        <button mat-raised-button color="accent" (click)="transferAllToCart()">
          <mat-icon>shopping_cart</mat-icon>
          Move All to Cart
        </button>
      </div>

      <div class="share-section" *ngIf="shareCode">
        <mat-form-field class="share-link">
          <mat-label>Share Link</mat-label>
          <input matInput [value]="getShareLink()" readonly #shareInput>
          <button mat-icon-button matSuffix (click)="copyShareLink(shareInput)">
            <mat-icon>content_copy</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <div class="wishlist-grid" *ngIf="items.length > 0">
        <mat-card *ngFor="let item of items" class="product-card">
          <img mat-card-image [src]="item.image" [alt]="item.name">
          <mat-card-content>
            <h2>{{item.name}}</h2>
            <p class="price">₹{{item.price}}</p>
            <div class="rating">
              <mat-icon *ngFor="let star of [1,2,3,4,5]" 
                       [class.filled]="(hoveredRating[getItemId(item)] || item.rating || 0) >= star"
                       (mouseenter)="hoveredRating[getItemId(item)] = star"
                       (mouseleave)="hoveredRating[getItemId(item)] = 0"
                       (click)="rateProduct(item, star)"
                       [matTooltip]="'Rate ' + star + ' ' + (star === 1 ? 'star' : 'stars')"
                       style="cursor: pointer; transition: color 0.2s ease-in-out;">
                star
              </mat-icon>
              <span>({{item.reviews || 0}} {{item.reviews === 1 ? 'review' : 'reviews'}})</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="moveToCart(item)">
              <mat-icon>shopping_cart</mat-icon>
              Move to Cart
            </button>
            <button mat-icon-button color="warn" (click)="removeFromWishlist(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-wishlist" *ngIf="items.length === 0">
        <mat-icon>favorite_border</mat-icon>
        <h2>Your wishlist is empty</h2>
        <p>Add items to your wishlist while shopping</p>
        <button mat-raised-button color="primary" routerLink="/shop">
          Continue Shopping
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .wishlist-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .share-section {
      margin: 20px 0;
      .share-link {
        width: 100%;
        max-width: 500px;
      }
    }

    .wishlist-grid {
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
        margin: 8px 0;
        
        mat-icon {
          color: #ccc;
          font-size: 24px;
          width: 24px;
          height: 24px;
          
          &.filled {
            color: #ffd700;
          }

          &:hover {
            transform: scale(1.1);
          }
        }

        span {
          color: #666;
          font-size: 0.9em;
          margin-left: 4px;
        }
      }
    }

    .empty-wishlist {
      text-align: center;
      padding: 40px;
      
      mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #ccc;
      }
      
      h2 {
        margin: 20px 0;
        color: #666;
      }
      
      p {
        color: #999;
        margin-bottom: 20px;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  items: Product[] = [];
  shareCode: string | null = null;
  hoveredRating: { [key: string]: number } = {}; // Track hovered rating for each product

  getItemId(item: Product): string {
    return (item._id || item.id || '').toString();
  }

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getWishlistItems().subscribe({
      next: (items) => {
        this.items = items;
      },
      error: (error) => {
        if (error.status === 401) {
          this.snackBar.open('Please login to view your wishlist', 'Login', {
            duration: 5000
          }).onAction().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.snackBar.open('Error loading wishlist', 'Close', {
            duration: 3000
          });
        }
      }
    });
  }

  shareWishlist() {
    const emails = prompt('Enter email addresses to share with (comma-separated):');
    if (emails) {
      const emailList = emails.split(',').map(email => email.trim());
      this.wishlistService.shareWishlist(emailList).subscribe({
        next: (response) => {
          this.shareCode = response.shareCode;
          this.snackBar.open('Wishlist shared successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Error sharing wishlist', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  getShareLink(): string {
    return `${window.location.origin}/wishlist/shared/${this.shareCode}`;
  }

  copyShareLink(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    this.snackBar.open('Share link copied to clipboard', 'Close', {
      duration: 2000
    });
  }

  moveToCart(item: Product) {
    this.cartService.addToCart(item).subscribe({
      next: () => {
        const productId = this.getItemId(item);
        if (productId) {
          this.wishlistService.removeFromWishlist(productId).subscribe({
            next: () => {
              this.loadWishlist();
              this.snackBar.open('Item moved to cart', 'Close', {
                duration: 3000
              });
            }
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error moving item to cart', 'Close', {
          duration: 3000
        });
      }
    });
  }

  transferAllToCart() {
    const itemIds = this.items
      .map(item => this.getItemId(item))
      .filter(id => id) as string[];

    if (itemIds.length === 0) return;

    this.wishlistService.transferToCart(itemIds).subscribe({
      next: (response) => {
        this.items = response.remainingItems;
        this.snackBar.open('All items moved to cart', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        this.snackBar.open('Error moving items to cart', 'Close', {
          duration: 3000
        });
      }
    });
  }

  removeFromWishlist(item: Product) {
    const productId = this.getItemId(item);
    if (productId) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.loadWishlist();
          this.snackBar.open('Item removed from wishlist', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Error removing item from wishlist', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  rateProduct(item: Product, rating: number) {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please login to rate products', 'Close', {
        duration: 3000
      });
      return;
    }

    const productId = this.getItemId(item);
    if (!productId) {
      this.snackBar.open('Error: Product ID not found', 'Close', {
        duration: 3000
      });
      return;
    }

    this.productService.rateProduct(productId, rating).subscribe({
      next: (updatedProduct) => {
        // Update the product in the wishlist
        const index = this.items.findIndex(p => this.getItemId(p) === productId);
        if (index !== -1) {
          this.items[index] = updatedProduct;
        }
        this.snackBar.open(`Rated ${rating} stars successfully`, 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        if (error.status === 401) {
          this.snackBar.open('Please login to rate products', 'Close', {
            duration: 3000
          });
        } else if (error.status === 400 && error.error?.message === 'You have already rated this product') {
          this.snackBar.open('You have already rated this product', 'Close', {
            duration: 3000
          });
        } else if (error.status === 429) {
          // Rate limit error
          this.snackBar.open(error.error?.message || 'Too many requests, please try again later', 'Close', {
            duration: 5000
          });
        } else {
          this.snackBar.open('Error rating product', 'Close', {
            duration: 3000
          });
        }
      }
    });
  }
}
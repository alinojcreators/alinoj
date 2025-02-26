import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from '../../../services/shop/cart.services';
import { CartItem } from '../../../services/shop/cart.services';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  private loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        // Filter out items with invalid products
        this.cartItems = items.filter(item => item && item.product);
        this.updateTotal();
        
        // Show warning if some items were filtered out
        const invalidItems = items.filter(item => !item || !item.product);
        if (invalidItems.length > 0) {
          this.showWarning(`${invalidItems.length} invalid item(s) were removed from your cart`);
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        if (error.status === 401) {
          this.showError('Please log in to view your cart');
        } else {
          this.showError('Error loading cart items');
        }
      }
    });

    // Subscribe to cart total
    this.cartService.getCartTotal().subscribe({
      next: (total) => {
        this.total = total;
      },
      error: (error) => {
        console.error('Error getting cart total:', error);
      }
    });
  }

  private updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      if (!item?.product) return sum;
      const price = item.product.sellingPrice || item.product.price || 0;
      return sum + (price * (item.quantity || 0));
    }, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    const productId = item?.product?._id || item?.product?.id;
    if (!productId) {
      console.error('Invalid product in cart:', item);
      this.showError('Unable to update quantity. Please try removing and adding the item again.');
      return;
    }

    if (newQuantity < 1) {
      this.removeFromCart(item);
      return;
    }

    if (item.product.stock && newQuantity > item.product.stock) {
      this.showError(`Only ${item.product.stock} items available in stock`);
      return;
    }

    this.cartService.updateQuantity(productId, newQuantity).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.updateTotal();
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.showError('Failed to update quantity. Please try again.');
      }
    });
  }

  removeFromCart(item: CartItem) {
    const productId = item?.product?._id || item?.product?.id;
    if (!productId) {
      console.error('Invalid product in cart:', item);
      this.showError('Unable to remove item. Please refresh the page and try again.');
      return;
    }

    this.cartService.removeFromCart(productId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.updateTotal();
        this.showSuccess('Item removed from cart');
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.showError('Failed to remove item. Please try again.');
      }
    });
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      this.showError('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showWarning(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['warning-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  private loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.updateTotal();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        if (error.status === 401) {
          this.showError('Please log in to view your cart');
        } else {
          this.showError('Failed to load cart items');
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
      const price = item.product.sellingPrice || item.product.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    const productId = item.product._id || item.product.id;
    if (!productId) {
      this.showError('Invalid product');
      return;
    }

    if (newQuantity < 1) {
      this.showError('Quantity must be at least 1');
      return;
    }

    if (newQuantity > (item.product.stock || 0)) {
      this.showError('Not enough stock available');
      return;
    }

    // Now productId is guaranteed to be a string
    this.cartService.updateQuantity(productId as string, newQuantity).subscribe({
      next: () => {
        this.loadCartItems(); // Reload cart after update
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.showError(error.message || 'Failed to update quantity');
      }
    });
  }

  removeItem(item: CartItem) {
    const productId = item.product._id || item.product.id;
    if (!productId) {
      this.showError('Invalid product');
      return;
    }

    // Now productId is guaranteed to be a string
    this.cartService.removeFromCart(productId as string).subscribe({
      next: () => {
        this.loadCartItems(); // Reload cart after removal
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.showError(error.message || 'Failed to remove item');
      }
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
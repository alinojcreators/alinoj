import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../../services/shop/product.service';
import { ProductFormDialogComponent } from './product-form-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.scss']
})
export class ProductMasterComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'name',
    'brand',
    'category',
    'price',
    'stock',
    'rating',
    'onSale',
    'actions'
  ];
  products: Product[] = [];
  totalProducts = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;
  searchTerm = '';
  apiUrl = environment.apiUrl;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    console.log('Loading products...');
    this.productService.getProducts({
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined
    }).pipe(
      catchError(error => {
        console.error('Error loading products:', error);
        this.showError('Error loading products');
        return of({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
      })
    ).subscribe(response => {
      console.log('Raw response:', response);
      // Transform the image URLs to include the full backend URL
      this.products = response.items.map(product => {
        console.log('Processing product:', product);
        console.log('Media:', product.media);
        
        // Get image URL from media or use placeholder
        let imageUrl = 'assets/placeholder-image.png';
        if (product.media && product.media.length > 0) {
          const primaryImage = product.media.find(m => m.isPrimary) || product.media[0];
          imageUrl = primaryImage.url;
        }
        
        const transformedProduct = {
          ...product,
          image: imageUrl
        };
        console.log('Transformed product:', transformedProduct);
        return transformedProduct;
      });
      
      console.log('Final transformed products:', this.products);
      this.totalProducts = response.total;
      this.loading = false;
    });
  }

  openProductDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '600px',
      data: product ? { ...product } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (product) {
          // Update existing product
          const productId = product._id || product.id;
          this.productService.updateProduct(productId!, result).pipe(
            catchError(error => {
              this.showError('Error updating product');
              console.error('Update error:', error);
              return of(null);
            })
          ).subscribe(updatedProduct => {
            if (updatedProduct) {
              this.showSuccess('Product updated successfully');
              this.loadProducts();
            }
            this.loading = false;
          });
        } else {
          // Create new product
          this.productService.createProduct(result).pipe(
            catchError(error => {
              this.showError('Error creating product');
              console.error('Create error:', error);
              return of(null);
            })
          ).subscribe(newProduct => {
            if (newProduct) {
              this.showSuccess('Product created successfully');
              this.loadProducts();
            }
            this.loading = false;
          });
        }
      }
    });
  }

  deleteProduct(productId: string) {
    if (!productId) {
      this.showError('Invalid product ID');
      return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      console.log('Deleting product with ID:', productId);
      this.productService.deleteProduct(productId).pipe(
        catchError(error => {
          this.showError('Error deleting product');
          console.error('Delete error:', error);
          return of(null);
        })
      ).subscribe(() => {
        this.showSuccess('Product deleted successfully');
        this.loadProducts();
        this.loading = false;
      });
    }
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
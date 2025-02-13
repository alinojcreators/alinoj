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
    this.productService.getProducts({
      page: this.currentPage + 1,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined
    }).pipe(
      catchError(error => {
        this.showError('Error loading products');
        return of({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
      })
    ).subscribe(response => {
      // Transform the image URLs to include the full backend URL
      this.products = response.items.map(product => ({
        ...product,
        image: product.image ? 
          (product.image.startsWith('http') ? product.image : `${environment.baseUrl}${product.image}`) : 
          'assets/placeholder-image.png'
      }));
      this.totalProducts = response.total;
      this.loading = false;
    });
  }

  openProductDialog(product?: Product) {
    const dialogData = product ? {
      id: product.id,
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      taxRate: product.taxRate,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      currency: product.currency,
      description: product.description,
      image: product.image,
      tags: product.tags,
      onSale: product.onSale
    } : {};

    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: FormData | null) => {
      if (result) {
        const productId = product?.id;
        
        if (productId) {
          this.productService.updateProduct(productId, result).pipe(
            catchError(error => {
              const errorMessage = error.error?.message || 'Error updating product';
              this.showError(errorMessage);
              return of(null);
            })
          ).subscribe(response => {
            if (response) {
              this.showSuccess('Product updated successfully');
              this.loadProducts();
            }
          });
        } else {
          this.productService.createProduct(result).pipe(
            catchError(error => {
              const errorMessage = error.error?.message || 'Error creating product';
              this.showError(errorMessage);
              return of(null);
            })
          ).subscribe(response => {
            if (response) {
              this.showSuccess('Product created successfully');
              this.loadProducts();
            }
          });
        }
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).pipe(
        catchError(error => {
          this.showError('Error deleting product');
          return of(null);
        })
      ).subscribe(response => {
        this.showSuccess('Product deleted successfully');
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
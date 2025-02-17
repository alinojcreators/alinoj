import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProductService, ProductFilter, ProductResponse } from '../../../../services/shop/product.service';
import { CartService } from '../../../../services/shop/cart.services';
import { WishlistService } from '../../../../services/shop/wishlist.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-shop-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatTooltipModule
  ],
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.scss']
})
export class ShopCategoryComponent implements OnInit, OnDestroy {
  categoryName = '';
  products: Product[] = [];
  loading = false;
  totalProducts = 0;
  currentPage = 0;
  pageSize = 12;
  isMobile = false;
  isFilterOpen = false;
  wishlistItems: Set<string> = new Set();

  sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

  filterForm: FormGroup;
  searchControl = new FormControl('');
  availableBrands: string[] = [];
  availableTags: string[] = [];
  selectedBrands: string[] = [];
  selectedTags: string[] = [];

  private destroy$ = new Subject<void>();
  private searchDebounce$ = new Subject<string>();

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      sortBy: ['newest'],
      minPrice: [0],
      maxPrice: [1000],
      brands: [[]],
      tags: [[]]
    });

    this.checkScreenSize();
  }

  ngOnInit() {
    // Load available filters
    this.loadFilterOptions();

    // Subscribe to route params
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.categoryName = this.formatCategoryName(params['category']);
      this.loadProducts();
    });

    // Subscribe to form changes
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProducts();
    });

    // Subscribe to search changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.currentPage = 0;
      this.loadProducts();
    });

    this.loadWishlist();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isFilterOpen = !this.isMobile;
  }

  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  clearFilters() {
    this.filterForm.patchValue({
      sortBy: 'newest',
      minPrice: 0,
      maxPrice: 1000,
      brands: [],
      tags: []
    });
    this.searchControl.setValue('');
    this.selectedBrands = [];
    this.selectedTags = [];
  }

  toggleBrand(brand: string) {
    const index = this.selectedBrands.indexOf(brand);
    if (index === -1) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands.splice(index, 1);
    }
    this.filterForm.patchValue({ brands: this.selectedBrands });
  }

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.filterForm.patchValue({ tags: this.selectedTags });
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.includes(brand);
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }

  clearPriceFilter() {
    this.filterForm.patchValue({
      minPrice: 0,
      maxPrice: 1000
    });
  }

  get minPrice(): number {
    return this.filterForm.get('minPrice')?.value ?? 0;
  }

  get maxPrice(): number {
    return this.filterForm.get('maxPrice')?.value ?? 1000;
  }

  get hasPriceFilter(): boolean {
    return this.minPrice > 0 || this.maxPrice < 1000;
  }

  get hasActiveFilters(): boolean {
    return (
      !!this.searchControl.value ||
      this.selectedBrands.length > 0 ||
      this.selectedTags.length > 0 ||
      this.hasPriceFilter
    );
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchControl.value) count++;
    count += this.selectedBrands.length;
    count += this.selectedTags.length;
    if (this.hasPriceFilter) count++;
    return count;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  isNewProduct(product: Product): boolean {
    if (!product.createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(product.createdAt) > thirtyDaysAgo;
  }

  isInWishlist(product: Product): boolean {
    const productId = product._id || product.id;
    return productId ? this.wishlistItems.has(productId) : false;
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

  loadWishlist() {
    this.wishlistService.getWishlistItems().subscribe({
      next: (items) => {
        this.wishlistItems = new Set(items.map(item => item._id || item.id || '').filter(id => id));
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product).subscribe(
      () => {
        this.snackBar.open('Added to cart successfully', 'Close', {
          duration: 3000
        });
      },
      error => {
        this.snackBar.open('Failed to add to cart', 'Close', {
          duration: 3000
        });
      }
    );
  }

  private loadFilterOptions() {
    this.productService.getBrands().pipe(
      takeUntil(this.destroy$)
    ).subscribe(brands => {
      this.availableBrands = brands;
    });

    this.productService.getTags().pipe(
      takeUntil(this.destroy$)
    ).subscribe(tags => {
      this.availableTags = tags;
    });
  }

  private loadProducts() {
    this.loading = true;
    const formValue = this.filterForm.value;

    const filter: ProductFilter = {
      category: this.categoryName.toLowerCase(),
      search: this.searchControl.value || undefined,
      minPrice: formValue.minPrice,
      maxPrice: formValue.maxPrice,
      brands: this.selectedBrands,
      tags: this.selectedTags,
      sortBy: formValue.sortBy.split('_')[0] as 'price' | 'rating' | 'newest',
      sortOrder: formValue.sortBy.includes('desc') ? 'desc' : 'asc',
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };

    this.productService.getProducts(filter).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: ProductResponse) => {
        this.products = response.items;
        this.totalProducts = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private formatCategoryName(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
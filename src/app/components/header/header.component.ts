import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AuthService, User } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { CartService } from '../../services/shop/cart.services';
import { WishlistService } from '@app/services/shop/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  isLoggedIn = false;
  isAdminUser = false;
  username = '';
  isMenuOpen = false;
  isCoursesMenuOpen = false;
  wishlistItemCount = 0;
  cartItemCount = 0;
  courseCategories = [
    {
      name: 'Programming',
      icon: 'M12 2.5l10 5v10l-10 5-10-5v-10l10-5zM4 7.5v8l8 4 8-4v-8l-8-4-8 4z',
      subcategories: [
        { name: 'Web Development', route: '/courses/web-development', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c.43 1.43 1.08 2.76 1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56z' },
        { name: 'Mobile Development', route: '/courses/mobile-development', icon: 'M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z' },
        { name: 'Backend Development', route: '/courses/backend-development', icon: 'M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z' }
      ]
    },
    {
      name: 'Data Science',
      icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z',
      subcategories: [
        { name: 'Machine Learning', route: '/courses/machine-learning', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z' },
        { name: 'Data Analysis', route: '/courses/data-analysis', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z' },
        { name: 'AI & Deep Learning', route: '/courses/ai-deep-learning', icon: 'M20 4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v2H4V6zm16 12H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z' }
      ]
    },
    {
      name: 'Design',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.94 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
      subcategories: [
        { name: 'UI/UX Design', route: '/courses/ui-ux-design', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.78.78-1.17 1.82-1.17 2.83V15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
        { name: 'Graphic Design', route: '/courses/graphic-design', icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm0 0H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z' },
        { name: 'Product Design', route: '/courses/product-design', icon: 'M2 12h2v3h16v-3h2v5H2zm0-5h2V4h16v3h2V3c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4h2v4h2v-4H2v-3z' }
      ]
    },
    {
      name: 'Cloud & DevOps',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.94 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
      subcategories: [
        { name: 'AWS Cloud', route: '/courses/aws-cloud', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.78.78-1.17 1.82-1.17 2.83V15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
        { name: 'Docker & Kubernetes', route: '/courses/docker-kubernetes', icon: 'M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z' },
        { name: 'CI/CD Pipelines', route: '/courses/ci-cd-pipelines', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z' }
      ]
    }
  ];
  ecommerceCategories = [
    {
      name: 'Shop by Category',
      icon: 'category',
      subcategories: [
        { name: 'Electronics', route: '/shop/electronics', icon: 'devices' },
        { name: 'Fashion', route: '/shop/fashion', icon: 'checkroom' },
        { name: 'Home & Living', route: '/shop/home-living', icon: 'home' },
        { name: 'Books', route: '/shop/books', icon: 'menu_book' },
        { name: 'Sports', route: '/shop/sports', icon: 'sports_soccer' }
      ]
    },
    {
      name: 'Special Offers',
      icon: 'local_offer',
      subcategories: [
        { name: 'Deals of the Day', route: '/shop/deals', icon: 'bolt' },
        { name: 'Clearance Sale', route: '/shop/clearance', icon: 'sell' },
        { name: 'New Arrivals', route: '/shop/new-arrivals', icon: 'new_releases' }
      ]
    },
    {
      name: 'Customer Service',
      icon: 'support_agent',
      subcategories: [
        { name: 'Track Order', route: '/shop/track-order', icon: 'local_shipping' },
        { name: 'Returns', route: '/shop/returns', icon: 'assignment_return' },
        { name: 'Help Center', route: '/shop/help', icon: 'help' }
      ]
    }
  ];
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private dialogService: DialogService,
    private cartService: CartService,
    private router: Router,
    private wishlistService: WishlistService
  ) {
    this.subscriptions.push(
      this.wishlistService.getWishlistItems().subscribe(items => {
        this.wishlistItemCount = items.length;
      })
    );

    this.translateService.setTranslation('en', {
      HEADER: {
        HOME: 'Home',
        COURSES: 'Courses',
        SHOP: 'Shop',
        ABOUT: 'About',
        CONTACT: 'Contact',
        LOGIN: 'Login',
        REGISTER: 'Register',
        LOGOUT: 'Logout',
        PROFILE: 'Profile'
      }
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.getCartCount().subscribe((count: number) => {
        this.cartItemCount = count;
      })
    );
    this.authSubscription = this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.updateUserState(user);
        } else {
          this.resetUserState();
        }
      },
      error: (err) => {
        console.error('Error getting current user:', err);
        this.resetUserState();
      }
    });
  }

  private checkAndRestoreUser(): void {
    // Try to get user from service (which checks localStorage)
    const user = this.authService.getCurrentUserSync();
    
    if (user) {
      this.updateUserState(user);
    }
  }

  private updateUserState(user: User): void {
    this.currentUser = user;
    this.isLoggedIn = true;
    this.username = user.name;
    this.isAdminUser = user.role === 'admin' || user.role === 'superadmin';
    
    console.log('User state updated:', {
      name: this.username,
      role: user.role,
      isAdmin: this.isAdminUser
    });
  }

  private resetUserState(): void {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.username = '';
    this.isAdminUser = false;
    
    console.log('User state reset');
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Add body class to prevent scrolling when menu is open on mobile
    if (this.isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }

  toggleCoursesMenu() {
    this.isCoursesMenuOpen = !this.isCoursesMenuOpen;
  }

  switchLanguage(lang: string) {
    this.translateService.use(lang);
  }

  openLogin() {
    this.dialogService.openLogin();
    this.isMenuOpen = false;
  }

  openRegister() {
    this.dialogService.openRegister();
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToHeaderManagement(): void {
    console.log('Navigating to header management', {
      isLoggedIn: this.isLoggedIn,
      userRole: this.currentUser?.role
    });
    this.router.navigate(['/header-master'], { 
      replaceUrl: true,
      queryParams: {
        userRole: this.currentUser?.role
      }
    }).then(
      success => console.log('Navigation to Header Management successful'),
      error => console.error('Navigation to Header Management failed', error)
    );
  }

  navigateToCart() {
    this.router.navigate(['/shop/cart']);
  }
}

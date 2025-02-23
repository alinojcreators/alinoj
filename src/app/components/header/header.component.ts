import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
  ]
})
export class HeaderComponent implements OnInit {
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
      name: 'Frontend Development',
      icon: 'code',
      subcategories: [
        { name: 'Angular', route: '/courses/angular', icon: 'change_history' },
        { name: 'React', route: '/courses/react', icon: 'radio_button_unchecked' },
        { name: 'Vue.js', route: '/courses/vuejs', icon: 'lens' },
        { name: 'HTML & CSS', route: '/courses/html-css', icon: 'html' },
        { name: 'JavaScript', route: '/courses/javascript', icon: 'javascript' }
      ]
    },
    {
      name: 'Backend Development',
      icon: 'dns',
      subcategories: [
        { name: 'Express.js', route: '/courses/expressjs', icon: 'memory' },
        { name: 'MEAN Stack', route: '/courses/mean-stack', icon: 'layers' },
        { name: 'MERN Stack', route: '/courses/mern-stack', icon: 'developer_board' }
      ]
    },
    {
      name: 'AI & Machine Learning',
      icon: 'psychology',
      subcategories: [
        { name: 'Machine Learning', route: '/courses/machine-learning', icon: 'auto_awesome' },
        { name: 'Deep Learning', route: '/courses/deep-learning', icon: 'bubble_chart' }
      ]
    },
    {
      name: 'Programming for Kids',
      icon: 'child_care',
      subcategories: [
        { name: 'Robotics', route: '/courses/robotics', icon: 'smart_toy' },
        { name: 'Scratch Coding', route: '/courses/scratch', icon: 'extension' }
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
  currentLang: string;
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ta', name: 'தமிழ்' }
  ];

  @ViewChild('coursesMenuTrigger') coursesMenuTrigger!: MatMenuTrigger;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private translate: TranslateService
  ) {
    // Get browser language
    const browserLang = navigator.language;
    
    // Set default language as English
    this.translate.setDefaultLang('en');
    
    // Automatically detect and set language
    if (browserLang) {
      // Check if browser language starts with 'ta' for Tamil
      const userLang = browserLang.toLowerCase().startsWith('ta') ? 'ta' : 'en';
      this.currentLang = userLang;
      this.translate.use(userLang);
      
      // Store the language preference in localStorage
      localStorage.setItem('preferredLanguage', userLang);
    } else {
      // Fallback to stored preference or default to English
      const storedLang = localStorage.getItem('preferredLanguage');
      this.currentLang = storedLang || 'en';
      this.translate.use(this.currentLang);
    }
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

  switchLanguage(langCode: string): void {
    this.currentLang = langCode;
    this.translate.use(langCode);
    localStorage.setItem('preferredLanguage', langCode);
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
    this.router.navigate(['/header-management']).then(
      (success: boolean) => console.log('Navigation to Header Management successful'),
      (error: Error) => console.error('Navigation to Header Management failed:', error)
    );
  }

  navigateToCart() {
    this.router.navigate(['/shop/cart']);
  }

  navigateToDashboard() {
    console.log('Attempting to navigate to dashboard');
    this.router.navigate(['/dashboard']).then(
      (success) => {
        if (success) {
          console.log('Navigation to dashboard successful');
        } else {
          console.warn('Navigation to dashboard was prevented');
        }
      },
      (error) => console.error('Navigation to dashboard failed:', error)
    );
  }
}

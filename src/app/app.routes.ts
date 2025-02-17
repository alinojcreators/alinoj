import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { ToolsComponent } from './components/tools/tools.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { HeaderMasterComponent } from './components/header-master/header-master.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { SuperadminGuard } from './guards/superadmin.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShopComponent } from './components/shop/shop.component';
import { ShopCategoryComponent } from './components/shop/category/shop-category/shop-category.component';
import { ProductMasterComponent } from './components/shop/product-master/product-master.component';
import { CartComponent } from './components/shop/cart/cart.component';
import { WishlistComponent } from './services/shop/wishlist/wishlist.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [authGuard('anonymous')] 
  },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'tools', component: ToolsComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'admin/products',
    component: ProductMasterComponent
  },
  {
    path: 'shop/cart',
    component: CartComponent,
    title: 'Shopping Cart'
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'wishlist/shared/:shareCode',
    component: WishlistComponent
  },
  
  { 
    path: 'portfolio', 
    component: PortfolioComponent,
    canActivate: [authGuard('user')]
  },
  { 
    path: 'user-management', 
    component: UserManagementComponent,
    canActivate: [authGuard('admin')]
  },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent,
    canActivate: [authGuard('admin')]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [authGuard('user')]
  },
  {
    path: 'header-master',
    component: HeaderMasterComponent,
    canActivate: [authGuard('admin')],
    children: [],
    pathMatch: 'full'
  },
  { 
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'shop/:category',
    component: ShopCategoryComponent
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

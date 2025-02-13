import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  categories = [
    {
      name: 'Electronics',
      icon: 'devices',
      route: '/shop/electronics',
      description: 'Latest gadgets and electronic devices'
    },
    {
      name: 'Fashion',
      icon: 'checkroom',
      route: '/shop/fashion',
      description: 'Trendy clothing and accessories'
    },
    {
      name: 'Home & Living',
      icon: 'home',
      route: '/shop/home-living',
      description: 'Home decor and furniture'
    },
    {
      name: 'Books',
      icon: 'menu_book',
      route: '/shop/books',
      description: 'Books and educational materials'
    },
    {
      name: 'Sports',
      icon: 'sports_soccer',
      route: '/shop/sports',
      description: 'Sports equipment and accessories'
    }
  ];
}
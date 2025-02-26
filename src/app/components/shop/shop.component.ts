import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Meta, Title } from '@angular/platform-browser';

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
export class ShopComponent implements OnInit {
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

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  ngOnInit() {
    this.setupSEO();
  }

  private setupSEO() {
    const title = 'Shop - Alinoj Creators';
    const description = 'Browse and purchase creative tools, templates, and resources in the Alinoj Creators shop. Find everything you need to enhance your digital creation workflow.';
    const keywords = 'creative marketplace, digital tools, creator resources, templates, Alinoj shop, content creation tools';

    this.title.setTitle(title);
    
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    
    // OpenGraph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: 'https://alinoj.com/shop' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: 'assets/images/alinoj-shop-preview.jpg' });
    
    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: 'assets/images/alinoj-shop-preview.jpg' });
  }
}
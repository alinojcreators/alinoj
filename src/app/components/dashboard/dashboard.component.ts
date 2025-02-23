import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { PortfolioComponent } from '@app/portfolio/portfolio.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ToolsComponent } from '../tools/tools.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ServiceCard {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContactComponent, 
    AboutComponent, 
    ServicesComponent,
    PortfolioComponent,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    ToolsComponent,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInText', [
      transition(':enter', [
        query('.animate-text', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(200, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  currentLang = 'en';
  currentIndex = 0;
  images = [
    'assets/images/slider1.jpg',
    'assets/images/slider2.jpg',
    'assets/images/slider3.jpg'
  ];

  whatWeDo: ServiceCard[] = [
    {
      icon: 'computer',
      titleKey: 'DASHBOARD.SERVICES.WEB_DEV.TITLE',
      descriptionKey: 'DASHBOARD.SERVICES.WEB_DEV.DESC'
    },
    {
      icon: 'phone_android',
      titleKey: 'DASHBOARD.SERVICES.MOBILE_DEV.TITLE',
      descriptionKey: 'DASHBOARD.SERVICES.MOBILE_DEV.DESC'
    },
    {
      icon: 'shopping_cart',
      titleKey: 'DASHBOARD.SERVICES.ECOMMERCE.TITLE',
      descriptionKey: 'DASHBOARD.SERVICES.ECOMMERCE.DESC'
    },
    {
      icon: 'school',
      titleKey: 'DASHBOARD.SERVICES.TRAINING.TITLE',
      descriptionKey: 'DASHBOARD.SERVICES.TRAINING.DESC'
    }
  ];

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit(): void {
    // Start the image slider
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000);
  }

  switchLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}

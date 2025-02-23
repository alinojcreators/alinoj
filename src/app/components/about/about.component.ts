import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { IntersectionObserverDirective } from '../../shared/directives/intersection-observer.directive';

import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, TranslateModule, IntersectionObserverDirective],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('expandCollapse', [
      state('collapsed', style({
        width: '0',
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      state('expanded', style({
        width: '*',
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('collapsed => expanded', [
        animate('800ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('expanded => collapsed', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class AboutComponent {
  visionState: 'expanded' | 'collapsed' = 'collapsed';

  whatWeDo = [
    { 
      icon: 'rocket', 
      translationKey: 'ABOUT.WHAT_WE_DO.ITEMS.WEB_DEV.TITLE', 
      descriptionKey: 'ABOUT.WHAT_WE_DO.ITEMS.WEB_DEV.DESCRIPTION' 
    },
    { 
      icon: 'shopping_cart', 
      translationKey: 'ABOUT.WHAT_WE_DO.ITEMS.ECOMMERCE.TITLE', 
      descriptionKey: 'ABOUT.WHAT_WE_DO.ITEMS.ECOMMERCE.DESCRIPTION' 
    },
    { 
      icon: 'computer', 
      translationKey: 'ABOUT.WHAT_WE_DO.ITEMS.IT_SERVICES.TITLE', 
      descriptionKey: 'ABOUT.WHAT_WE_DO.ITEMS.IT_SERVICES.DESCRIPTION' 
    },
    { 
      icon: 'psychology', 
      translationKey: 'ABOUT.WHAT_WE_DO.ITEMS.AI_ROBOTICS.TITLE', 
      descriptionKey: 'ABOUT.WHAT_WE_DO.ITEMS.AI_ROBOTICS.DESCRIPTION' 
    },
    { 
      icon: 'school', 
      translationKey: 'ABOUT.WHAT_WE_DO.ITEMS.TRAINING.TITLE', 
      descriptionKey: 'ABOUT.WHAT_WE_DO.ITEMS.TRAINING.DESCRIPTION' 
    }
  ];

  whyChooseUs = [
    { 
      icon: 'lightbulb', 
      translationKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.INNOVATION.TITLE', 
      descriptionKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.INNOVATION.DESCRIPTION' 
    },
    { 
      icon: 'settings', 
      translationKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.SOLUTIONS.TITLE', 
      descriptionKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.SOLUTIONS.DESCRIPTION' 
    },
    { 
      icon: 'trending_up', 
      translationKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.SCALABILITY.TITLE', 
      descriptionKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.SCALABILITY.DESCRIPTION' 
    },
    { 
      icon: 'code', 
      translationKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.LEARNING.TITLE', 
      descriptionKey: 'ABOUT.WHY_CHOOSE_US.ITEMS.LEARNING.DESCRIPTION' 
    }
  ];

  team = [
    {
      name: 'John Doe',
      position: 'Founder & CEO',
      image: 'assets/images/team/john-doe.jpg',
      description: 'Visionary leader with over 15 years of experience in e-commerce.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'john&#64;alinoj.com'
      }
    },
    {
      name: 'Jane Smith',
      position: 'Head of Operations',
      image: 'assets/images/team/jane-smith.jpg',
      description: 'Expert in supply chain management and customer satisfaction.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'jane&#64;alinoj.com'
      }
    }
  ];

  milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'AlinoJ was established with a vision to revolutionize online shopping.'
    },
    {
      year: '2021',
      title: 'Market Expansion',
      description: 'Expanded operations to cover all major cities in the region.'
    },
    {
      year: '2022',
      title: 'Digital Innovation',
      description: 'Launched our mobile app and implemented AI-powered recommendations.'
    },
    {
      year: '2023',
      title: 'Community Growth',
      description: 'Reached 1 million satisfied customers and established seller network.'
    }
  ];

  onIntersection(event: IntersectionObserverEntry[]) {
    if (event[0].isIntersecting) {
      requestAnimationFrame(() => {
        this.visionState = 'expanded';
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('500ms 100ms', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class PortfolioComponent {
  portfolioItems = [
    {
      title: 'Project One',
      description: 'Description of project one.',
      imageUrl: 'assets/images/marthandam_church.png',
      link: '/project1',
    },
    {
      title: 'Project Two',
      description: 'Description of project two.',
      imageUrl: 'assets/images/alinoj_logo2.png',
      link: '/project2',
    },
    {
      title: 'Project Three',
      description: 'Description of project three.',
      imageUrl: 'assets/images/marthandam_church.png',
      link: '/project3',
    },
    {
      title: 'Project Three',
      description: 'Description of project three.',
      imageUrl: 'assets/images/marthandam_church.png',
      link: '/project3',
    },
    
  ];
}

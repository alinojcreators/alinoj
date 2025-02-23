import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface FooterLink {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  currentYear = new Date().getFullYear();

  companyLinks = [
    { route: '/about', icon: 'info', label: 'FOOTER.LINKS.ABOUT' },
    { route: '/careers', icon: 'work', label: 'FOOTER.LINKS.CAREERS' },
    { route: '/contact', icon: 'contact_support', label: 'FOOTER.LINKS.CONTACT' }
  ];

  learningLinks = [
    { route: '/courses', icon: 'school', label: 'FOOTER.LINKS.COURSES' },
    { route: '/tutorials', icon: 'menu_book', label: 'FOOTER.LINKS.TUTORIALS' },
    { route: '/resources', icon: 'library_books', label: 'FOOTER.LINKS.RESOURCES' }
  ];

  legalLinks = [
    { route: '/privacy', icon: 'security', label: 'FOOTER.LINKS.PRIVACY' },
    { route: '/terms', icon: 'gavel', label: 'FOOTER.LINKS.TERMS' },
    { route: '/cookies', icon: 'cookie', label: 'FOOTER.LINKS.COOKIES' }
  ];

  socialLinks = [
    { icon: 'facebook', url: 'https://facebook.com' },
    { icon: 'twitter', url: 'https://twitter.com' },
    { icon: 'linkedin', url: 'https://linkedin.com' },
    { icon: 'instagram', url: 'https://instagram.com' }
  ];

  constructor() { }

  ngOnInit(): void { }

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}

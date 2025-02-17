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

  companyLinks: FooterLink[] = [
    { label: 'FOOTER.ABOUT_US', route: '/about', icon: 'info' },
    { label: 'FOOTER.CONTACT_US', route: '/contact', icon: 'contact_mail' },
    { label: 'FOOTER.CAREERS', route: '/careers', icon: 'work' }
  ];

  legalLinks: FooterLink[] = [
    { label: 'FOOTER.PRIVACY_POLICY', route: '/privacy', icon: 'privacy_tip' },
    { label: 'FOOTER.TERMS_OF_SERVICE', route: '/terms', icon: 'gavel' },
    { label: 'FOOTER.SITEMAP', route: '/sitemap', icon: 'map' }
  ];

  learningLinks: FooterLink[] = [
    { label: 'FOOTER.COURSES', route: '/courses', icon: 'school' },
    { label: 'FOOTER.LEARNING_PATHS', route: '/learning-paths', icon: 'track_changes' },
    { label: 'FOOTER.RESOURCES', route: '/resources', icon: 'library_books' }
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

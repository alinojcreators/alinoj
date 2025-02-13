import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface FooterLink {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
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
    { label: 'FOOTER.TERMS', route: '/terms', icon: 'gavel' },
    { label: 'FOOTER.PRIVACY', route: '/privacy', icon: 'security' }
  ];

  ngOnInit(): void {
  }
}

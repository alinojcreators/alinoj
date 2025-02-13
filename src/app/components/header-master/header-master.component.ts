import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-header-master',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="header-master-container">
      <mat-toolbar color="primary" class="header-master-toolbar">
        <button mat-icon-button routerLink="/" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Header Management</span>
      </mat-toolbar>

      <div class="header-master-content">
        <div class="section">
          <h2>Header Configuration</h2>
          <div class="config-grid">
            <mat-card class="config-card">
              <mat-card-header>
                <mat-card-title>Logo Settings</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <!-- Logo configuration options -->
                <button mat-raised-button color="primary">
                  Upload Logo
                </button>
              </mat-card-content>
            </mat-card>

            <mat-card class="config-card">
              <mat-card-header>
                <mat-card-title>Navigation Menu</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <!-- Navigation menu configuration -->
                <button mat-raised-button color="accent">
                  Edit Menu Items
                </button>
              </mat-card-content>
            </mat-card>

            <mat-card class="config-card">
              <mat-card-header>
                <mat-card-title>Color Scheme</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <!-- Color picker or predefined themes -->
                <button mat-raised-button color="warn">
                  Choose Theme
                </button>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>

    
    </div>
  `,
  styles: [`
    .header-master-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .header-master-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .back-button {
      margin-right: 16px;
    }

    .header-master-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .section {
      max-width: 1200px;
      margin: 0 auto;
    }

    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .config-card {
      transition: transform 0.3s ease;
    }

    .config-card:hover {
      transform: scale(1.05);
    }

    .header-master-footer {
      position: sticky;
      bottom: 0;
    }
  `]
})
export class HeaderMasterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Any initialization logic
  }
}

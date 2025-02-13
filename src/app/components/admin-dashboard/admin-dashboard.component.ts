import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <mat-grid-list cols="2" rowHeight="200px" gutterSize="20px">
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>User Management</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Manage users, roles, and permissions</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" routerLink="/admin/users">
                <mat-icon>people</mat-icon> Manage Users
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Content Management</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Manage site content and resources</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" routerLink="/admin/content">
                <mat-icon>article</mat-icon> Manage Content
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-card-title>Analytics</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>View site performance and user insights</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="warn" routerLink="/admin/analytics">
                <mat-icon>analytics</mat-icon> View Analytics
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
    }
    .dashboard-card {
      width: 100%;
      height: 100%;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get current user details
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }
}

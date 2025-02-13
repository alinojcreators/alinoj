import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container" *ngIf="currentUser">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <mat-card-title>{{ currentUser.name }}</mat-card-title>
          <mat-card-subtitle>{{ currentUser.email }}</mat-card-subtitle>
        </mat-card-header>

        <mat-divider></mat-divider>

        <mat-card-content>
          <div class="profile-details">
            <p><strong>Role:</strong> {{ formatRole(currentUser.role) }}</p>
            <p><strong>Joined:</strong> {{ currentUser.createdAt | date:'mediumDate' }}</p>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="editProfile()">
            <mat-icon>edit</mat-icon> Edit Profile
          </button>
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .profile-card {
      width: 100%;
      max-width: 500px;
    }
    .profile-avatar {
      background-color: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon {
        font-size: 40px;
      }
    }
    .profile-details {
      padding: 16px;
    }
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ensure user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get current user
    this.currentUser = this.authService.getCurrentUserSync();
  }

  formatRole(role: string): string {
    switch(role) {
      case 'superadmin': return 'Super Administrator';
      case 'admin': return 'Administrator';
      case 'user': return 'Regular User';
      default: return role;
    }
  }

  editProfile(): void {
    // TODO: Implement profile editing functionality
    console.log('Edit profile clicked');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

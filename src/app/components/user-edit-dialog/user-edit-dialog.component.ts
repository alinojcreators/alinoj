import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { User } from '@services/auth.service';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit User</h2>
    <mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Name" [(ngModel)]="data.name" disabled>
      </mat-form-field>
      
      <mat-form-field>
        <input matInput placeholder="Email" [(ngModel)]="data.email" disabled>
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>Role</mat-label>
        <mat-select [(ngModel)]="data.role">
          <mat-option value="user">User</mat-option>
          <mat-option value="admin">Admin</mat-option>
          <mat-option value="superadmin">Superadmin</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSaveClick()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 10px;
    }
  `]
})
export class UserEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}

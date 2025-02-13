import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TranslateModule
  ],
  template: `
    <div class="login-dialog">
      <h2 mat-dialog-title>{{ 'AUTH.LOGIN.TITLE' | translate }}</h2>
      <mat-dialog-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'AUTH.LOGIN.EMAIL' | translate }}</mat-label>
            <input matInput type="email" formControlName="email" [placeholder]="'AUTH.LOGIN.EMAIL_PLACEHOLDER' | translate">
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              {{ 'CONTACT.VALIDATION.EMAIL_REQUIRED' | translate }}
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              {{ 'CONTACT.VALIDATION.EMAIL_INVALID' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'AUTH.LOGIN.PASSWORD' | translate }}</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" 
                   [placeholder]="'AUTH.LOGIN.PASSWORD_PLACEHOLDER' | translate">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              {{ 'AUTH.LOGIN.PASSWORD_REQUIRED' | translate }}
            </mat-error>
          </mat-form-field>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ 'COMMON.CANCEL' | translate }}
        </button>
        <button mat-button (click)="openRegister()">
          {{ 'AUTH.LOGIN.REGISTER_LINK' | translate }}
        </button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loginForm.invalid || isLoading">
          {{ (isLoading ? 'AUTH.LOGIN.LOADING' : 'AUTH.LOGIN.SUBMIT') | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .login-dialog {
      padding: 16px;
      min-width: 320px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }

    .error-message {
      color: #f44336;
      font-size: 12px;
      margin-top: -8px;
    }

    mat-dialog-actions {
      margin-top: 16px;
      padding: 8px 0;
    }
  `]
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.translate.get('AUTH.LOGIN.ERROR').subscribe((res: string) => {
            this.errorMessage = res;
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  openRegister() {
    this.dialogRef.close('register');
  }
}

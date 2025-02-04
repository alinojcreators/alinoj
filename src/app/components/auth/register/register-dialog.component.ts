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
  selector: 'app-register-dialog',
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
    <div class="register-dialog">
      <h2 mat-dialog-title>{{ 'AUTH.REGISTER.TITLE' | translate }}</h2>
      <mat-dialog-content>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'AUTH.REGISTER.NAME' | translate }}</mat-label>
            <input matInput type="text" formControlName="name" [placeholder]="'AUTH.REGISTER.NAME_PLACEHOLDER' | translate">
            <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
              {{ 'CONTACT.VALIDATION.NAME_REQUIRED' | translate }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('name')?.hasError('minlength')">
              {{ 'CONTACT.VALIDATION.NAME_MIN_LENGTH' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'AUTH.REGISTER.EMAIL' | translate }}</mat-label>
            <input matInput type="email" formControlName="email" [placeholder]="'AUTH.REGISTER.EMAIL_PLACEHOLDER' | translate">
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              {{ 'CONTACT.VALIDATION.EMAIL_REQUIRED' | translate }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              {{ 'CONTACT.VALIDATION.EMAIL_INVALID' | translate }}
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'AUTH.REGISTER.PASSWORD' | translate }}</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password"
                   [placeholder]="'AUTH.REGISTER.PASSWORD_PLACEHOLDER' | translate">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              {{ 'AUTH.REGISTER.PASSWORD_REQUIRED' | translate }}
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              {{ 'AUTH.REGISTER.PASSWORD_MINLENGTH' | translate }}
            </mat-error>
          </mat-form-field>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="openLogin()">
          {{ 'AUTH.REGISTER.LOGIN_LINK' | translate }}
        </button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="registerForm.invalid || isLoading">
          {{ (isLoading ? 'AUTH.REGISTER.LOADING' : 'AUTH.REGISTER.SUBMIT') | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .register-dialog {
      padding: 16px;
      min-width: 320px;
    }

    .register-form {
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
export class RegisterDialogComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    private translate: TranslateService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { name, email, password } = this.registerForm.value;
      
      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.translate.get('AUTH.REGISTER.ERROR').subscribe((res: string) => {
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

  openLogin() {
    this.dialogRef.close('login');
  }
}

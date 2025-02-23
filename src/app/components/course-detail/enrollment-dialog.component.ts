import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-enrollment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Enroll in {{data.courseName}}</h2>
    <mat-dialog-content>
      <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="studentName" required>
          <mat-error *ngIf="enrollmentForm.get('studentName')?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-error *ngIf="enrollmentForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="enrollmentForm.get('email')?.hasError('email')">
            Please enter a valid email address
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Phone Number</mat-label>
          <input matInput formControlName="phone" required>
          <mat-error *ngIf="enrollmentForm.get('phone')?.hasError('required')">
            Phone number is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Country</mat-label>
          <mat-select formControlName="country" required>
            <mat-option *ngFor="let country of countries" [value]="country">
              {{country}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="enrollmentForm.get('country')?.hasError('required')">
            Country is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Additional Notes</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="enrollmentForm.invalid || enrollmentForm.pristine"
              (click)="onSubmit()">
        Enroll Now
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    textarea {
      min-height: 100px;
    }
  `]
})
export class EnrollmentDialogComponent {
  enrollmentForm: FormGroup;
  countries: string[] = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 
    'Germany', 'France', 'Japan', 'China', 'Brazil', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnrollmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: string; courseName: string }
  ) {
    this.enrollmentForm = this.fb.group({
      studentName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      country: ['', [Validators.required]],
      notes: ['']
    });
  }

  onSubmit() {
    if (this.enrollmentForm.valid) {
      const enrollmentData = {
        ...this.enrollmentForm.value,
        courseId: this.data.courseId,
        courseName: this.data.courseName
      };
      this.dialogRef.close(enrollmentData);
    } else {
      Object.keys(this.enrollmentForm.controls).forEach(key => {
        const control = this.enrollmentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{isEditMode ? 'Update' : 'Create'}} Product</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="productForm.get('name')?.errors?.['required']">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>SKU</mat-label>
          <input matInput formControlName="sku" required>
          <mat-error *ngIf="productForm.get('sku')?.errors?.['required']">SKU is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Brand</mat-label>
          <input matInput formControlName="brand" required>
          <mat-error *ngIf="productForm.get('brand')?.errors?.['required']">Brand is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" required>
          <mat-error *ngIf="productForm.get('category')?.errors?.['required']">Category is required</mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Cost Price</mat-label>
            <input matInput type="number" formControlName="costPrice" required>
            <mat-error *ngIf="productForm.get('costPrice')?.errors?.['required']">Cost price is required</mat-error>
            <mat-error *ngIf="productForm.get('costPrice')?.errors?.['min']">Cost price must be positive</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Selling Price</mat-label>
            <input matInput type="number" formControlName="sellingPrice" required>
            <mat-error *ngIf="productForm.get('sellingPrice')?.errors?.['required']">Selling price is required</mat-error>
            <mat-error *ngIf="productForm.get('sellingPrice')?.errors?.['min']">Selling price must be positive</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Tax Rate (%)</mat-label>
            <input matInput type="number" formControlName="taxRate" required>
            <mat-error *ngIf="productForm.get('taxRate')?.errors?.['required']">Tax rate is required</mat-error>
            <mat-error *ngIf="productForm.get('taxRate')?.errors?.['min']">Tax rate must be positive</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Currency</mat-label>
            <mat-select formControlName="currency" required>
              <mat-option value="USD">USD</mat-option>
              <mat-option value="EUR">EUR</mat-option>
              <mat-option value="GBP">GBP</mat-option>
            </mat-select>
            <mat-error *ngIf="productForm.get('currency')?.errors?.['required']">Currency is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Stock</mat-label>
            <input matInput type="number" formControlName="stock" required>
            <mat-error *ngIf="productForm.get('stock')?.errors?.['required']">Stock is required</mat-error>
            <mat-error *ngIf="productForm.get('stock')?.errors?.['min']">Stock must be positive</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reorder Level</mat-label>
            <input matInput type="number" formControlName="reorderLevel" required>
            <mat-error *ngIf="productForm.get('reorderLevel')?.errors?.['required']">Reorder level is required</mat-error>
            <mat-error *ngIf="productForm.get('reorderLevel')?.errors?.['min']">Reorder level must be positive</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required rows="3"></textarea>
          <mat-error *ngIf="productForm.get('description')?.errors?.['required']">Description is required</mat-error>
        </mat-form-field>

        <div class="file-upload-container">
          <label for="imageUpload" class="file-upload-label">Product Image</label>
          <input 
            type="file" 
            id="imageUpload" 
            (change)="onFileSelected($event)"
            accept="image/*"
            #fileInput
            [attr.data-error]="productForm.get('image')?.errors && productForm.get('image')?.touched"
          >
          <div class="file-name" *ngIf="selectedFileName">{{selectedFileName}}</div>
          <div class="error-message" *ngIf="productForm.get('image')?.errors?.['required'] && productForm.get('image')?.touched">
            Image is required
          </div>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Tags (comma-separated)</mat-label>
          <input matInput formControlName="tags">
        </mat-form-field>

        <mat-checkbox formControlName="onSale">On Sale</mat-checkbox>
        <mat-checkbox formControlName="hasVariants">Has Variants</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!productForm.valid">
        {{isEditMode ? 'Update' : 'Create'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
      max-height: 70vh;
      overflow-y: auto;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-row > * {
      flex: 1;
    }
    mat-form-field {
      width: 100%;
    }
    .file-upload-container {
      margin: 8px 0;
    }
    .file-upload-label {
      display: block;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
    input[type="file"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    input[type="file"][data-error="true"] {
      border-color: #f44336;
    }
    .file-name {
      margin-top: 4px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }
    .error-message {
      color: #f44336;
      font-size: 12px;
      margin-top: 4px;
    }
  `]
})
export class ProductFormDialogComponent {
  productForm: FormGroup;
  isEditMode: boolean;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Product>,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data.id;
    this.productForm = this.fb.group({
      id: [data.id || null],
      name: [data.name || '', Validators.required],
      sku: [data.sku || '', Validators.required],
      brand: [data.brand || '', Validators.required],
      category: [data.category || '', Validators.required],
      costPrice: [data.costPrice || 0, [Validators.required, Validators.min(0)]],
      sellingPrice: [data.sellingPrice || 0, [Validators.required, Validators.min(0)]],
      taxRate: [data.taxRate || 0, [Validators.required, Validators.min(0)]],
      stock: [data.stock || 0, [Validators.required, Validators.min(0)]],
      reorderLevel: [data.reorderLevel || 10, [Validators.required, Validators.min(0)]],
      currency: [data.currency || 'USD', Validators.required],
      description: [data.description || '', Validators.required],
      image: [null, Validators.required],
      tags: [data.tags?.join(', ') || ''],
      onSale: [data.onSale || false],
      hasVariants: [false]  // Default to false
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.markAsTouched();
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formValue).forEach(key => {
        if (key === 'image' && this.selectedFile) {
          formData.append('image', this.selectedFile);
        } else if (key === 'tags') {
          const tags = formValue[key] ? formValue[key].split(',').map((tag: string) => tag.trim()).filter(Boolean) : [];
          formData.append('tags', JSON.stringify(tags));
        } else if (key === 'hasVariants') {
          formData.append('hasVariants', 'false'); // Always set to false for now
        } else {
          formData.append(key, formValue[key]);
        }
      });

      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
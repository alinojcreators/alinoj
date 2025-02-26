import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/shop/cart.services';
import { UserProfileService, ShippingAddress } from '../../../services/shop/user-profile.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  cartItems: any[] = [];
  total = 0;
  savedAddresses: ShippingAddress[] = [];
  selectedSavedAddress: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private userProfileService: UserProfileService,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      useExistingAddress: ['', Validators.required],
      savedAddressId: [''],
      newAddress: this.fb.group({
        fullName: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      })
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit() {
    this.loadCartItems();
    this.loadSavedAddresses();

    // Watch for changes in useExistingAddress radio selection
    this.shippingForm.get('useExistingAddress')?.valueChanges.subscribe(useExisting => {
      if (useExisting === 'existing') {
        this.shippingForm.get('savedAddressId')?.setValidators([Validators.required]);
        this.shippingForm.get('newAddress')?.disable();
      } else {
        this.shippingForm.get('savedAddressId')?.clearValidators();
        this.shippingForm.get('newAddress')?.enable();
      }
      this.shippingForm.get('savedAddressId')?.updateValueAndValidity();
    });
  }

  private loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.updateTotal();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  private loadSavedAddresses() {
    this.userProfileService.getShippingAddresses().subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
        if (addresses.length > 0) {
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            this.shippingForm.patchValue({
              useExistingAddress: 'existing',
              savedAddressId: defaultAddress
            });
          }
        }
      },
      error: (error) => {
        console.error('Error loading saved addresses:', error);
      }
    });
  }

  private updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const price = item.product.sellingPrice || item.product.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  onSubmit() {
    if (this.shippingForm.valid && this.paymentForm.valid) {
      // Get the shipping address based on form selection
      let shippingAddress: ShippingAddress;
      
      if (this.shippingForm.get('useExistingAddress')?.value === 'existing') {
        shippingAddress = this.savedAddresses.find(
          addr => addr === this.shippingForm.get('savedAddressId')?.value
        )!;
      } else {
        shippingAddress = this.shippingForm.get('newAddress')?.value;
      }

      // Here you would typically make an API call to process the order
      console.log('Order submitted', {
        shipping: shippingAddress,
        payment: this.paymentForm.value,
        items: this.cartItems,
        total: this.total
      });
      
      // If it's a new address, save it
      if (this.shippingForm.get('useExistingAddress')?.value === 'new') {
        this.userProfileService.addShippingAddress(shippingAddress).subscribe({
          next: () => console.log('New address saved'),
          error: (error) => console.error('Error saving address:', error)
        });
      }

      // Clear the cart and redirect to confirmation
      this.cartService.clearCart().subscribe({
        next: () => {
          this.router.navigate(['/checkout/confirmation']);
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
    }
  }
}
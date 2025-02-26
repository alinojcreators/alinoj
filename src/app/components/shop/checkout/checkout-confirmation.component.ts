@Component({
    selector: 'app-checkout-confirmation',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
    template: `
      <div class="confirmation-container">
        <mat-card>
          <mat-card-content>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order has been successfully placed.</p>
            <button mat-raised-button color="primary" routerLink="/shop">
              Continue Shopping
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    `,
    styles: [`
      .confirmation-container {
        max-width: 600px;
        margin: 40px auto;
        text-align: center;
      }
      mat-card {
        padding: 20px;
      }
      button {
        margin-top: 20px;
      }
    `]
  })
  export class CheckoutConfirmationComponent {}
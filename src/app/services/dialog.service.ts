import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../components/auth/login/login-dialog.component';
import { RegisterDialogComponent } from '../components/auth/register/register-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openLogin() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'register') {
        this.openRegister();
      }
    });
  }

  openRegister() {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'login') {
        this.openLogin();
      }
    });
  }
}

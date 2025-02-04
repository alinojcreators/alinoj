import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dialogService = inject(DialogService);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Open login dialog instead of redirecting
  dialogService.openLogin();
  return false;
};

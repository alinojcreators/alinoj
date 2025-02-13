import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is an admin or superadmin
  const isAdmin = authService.isAdmin();

  if (isAdmin) {
    return true;
  }

  // Redirect unauthorized users
  router.navigate(['/login']);
  return false;
};

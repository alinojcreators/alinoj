import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (requiredAuth: 'admin' | 'user' | 'anonymous' = 'user'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Get current user
    const currentUser = authService.getCurrentUserSync();

    // Handle different authentication scenarios
    switch (requiredAuth) {
      case 'admin':
        // Require admin or superadmin role
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin')) {
          return true;
        }
        // Redirect to login if not an admin
        router.navigate(['/login']);
        return false;

      case 'user':
        // Require any authenticated user
        if (currentUser) {
          return true;
        }
        router.navigate(['/login']);
        return false;

      case 'anonymous':
        // Require no authentication (login/register pages)
        if (!currentUser) {
          return true;
        }
        // Redirect authenticated users away from login/register
        router.navigate(['/admin']);
        return false;

      default:
        // Unexpected auth type
        console.error('Invalid authentication type');
        router.navigate(['/']);
        return false;
    }
  };
};

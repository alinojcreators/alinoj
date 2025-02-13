import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperadminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user is a superadmin
    const isSuperAdmin = this.authService.isSuperAdmin();
    
    if (!isSuperAdmin) {
      // Redirect to unauthorized page if not a superadmin
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

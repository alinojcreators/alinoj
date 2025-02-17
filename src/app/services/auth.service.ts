import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt?: Date;
  updatedAt?: Date;
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  exp: number;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'token';
  private userKey = 'currentUser';
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAndInitializeUser();
  }

  // Check and initialize user from stored token and local storage
  private checkAndInitializeUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem(this.userKey);
    
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          let user: User;
          
          // Prefer stored user data if available
          if (storedUser) {
            user = JSON.parse(storedUser);
          } else {
            // Fallback to token data
            user = {
              id: decodedToken.id,
              name: decodedToken.name,
              email: decodedToken.email,
              role: decodedToken.role
            };
          }
          
          // Set user in behavior subject
          this.currentUserSubject.next(user);
          
          // Ensure user is stored in local storage
          localStorage.setItem(this.userKey, JSON.stringify(user));
          
          console.log('User restored from token:', user);
        } else {
          // Token expired, clear storage
          this.logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.logout();
      }
    }
  }

  register(userData: { name: string, email: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError(this.handleError<User>('register'))
    );
  }

  // Login method
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        // Store token in localStorage
        localStorage.setItem(this.tokenKey, response.token);
        // Store user in localStorage and update current user subject
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError<LoginResponse>('login'))
    );
  }

  // Logout method
  logout(): void {
    // Clear token from localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    // Clear current user
    this.currentUserSubject.next(null);
    
    // Redirect to login
    this.router.navigate(['/login']);
  }

  // Get current user as Observable
  getCurrentUser(): Observable<User | null> {
    // If no current user, check token
    if (!this.currentUserSubject.getValue()) {
      this.checkAndInitializeUser();
    }
    return this.currentUserSubject.asObservable();
  }

  // Synchronous method to get current user
  getCurrentUserSync(): User | null {
    const storedUser = localStorage.getItem(this.userKey);
    return storedUser ? JSON.parse(storedUser) : this.currentUserSubject.getValue();
  }

  getUserRole(): 'user' | 'admin' | 'superadmin' | null {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser ? currentUser.role : null;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'superadmin';
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}`, { headers }).pipe(
      catchError(this.handleError<User[]>('getAllUsers', []))
    );
  }

  updateUserRole(userId: string, newRole: 'user' | 'admin' | 'superadmin'): Observable<User> {
    const headers = this.createAuthHeaders();
    return this.http.patch<User>(`${this.apiUrl}/${userId}/role`, { role: newRole }, { headers }).pipe(
      catchError(this.handleError<User>('updateUserRole'))
    );
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return token 
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Optionally send error to remote logging infrastructure
      console.error(error);

      // Let the app keep running by returning a safe result
      return of(result as T);
    };
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Optional: Add method to check if current user is superadmin
  isSuperAdmin(): boolean {
    const user = this.getCurrentUserSync();
    return user?.role === 'superadmin';
  }

  // Optional: Add method to get user profile
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: this.createAuthHeaders()
    });
  }
}

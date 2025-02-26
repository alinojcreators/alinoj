import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shippingAddresses: ShippingAddress[];
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/users/profile`;
  private userProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl, this.getAuthHeaders()).pipe(
      tap(profile => this.userProfile.next(profile)),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        throw error;
      })
    );
  }

  getShippingAddresses(): Observable<ShippingAddress[]> {
    return this.http.get<ShippingAddress[]>(`${this.apiUrl}/shipping-addresses`, this.getAuthHeaders());
  }

  addShippingAddress(address: ShippingAddress): Observable<ShippingAddress[]> {
    return this.http.post<ShippingAddress[]>(`${this.apiUrl}/shipping-addresses`, address, this.getAuthHeaders());
  }

  updateShippingAddress(addressId: string, address: ShippingAddress): Observable<ShippingAddress[]> {
    return this.http.put<ShippingAddress[]>(`${this.apiUrl}/shipping-addresses/${addressId}`, address, this.getAuthHeaders());
  }

  setDefaultShippingAddress(addressId: string): Observable<ShippingAddress[]> {
    return this.http.put<ShippingAddress[]>(`${this.apiUrl}/shipping-addresses/${addressId}/default`, {}, this.getAuthHeaders());
  }
}
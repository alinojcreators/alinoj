import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Rating {
  productId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  getProductRatings(productId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/product/${productId}`);
  }

  addRating(productId: string, rating: number, review?: string): Observable<Rating> {
    const userId = localStorage.getItem('userId');
    return this.http.post<Rating>(`${this.apiUrl}/add`, {
      productId,
      userId,
      rating,
      review
    });
  }

  updateRating(ratingId: string, rating: number, review?: string): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${ratingId}`, { rating, review });
  }

  deleteRating(ratingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ratingId}`);
  }
}
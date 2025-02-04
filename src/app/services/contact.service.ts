import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:5000/api/contact';

  constructor(private http: HttpClient) { }

  submitContact(contactData: ContactForm): Observable<any> {
    return this.http.post(this.apiUrl, contactData);
  }
}

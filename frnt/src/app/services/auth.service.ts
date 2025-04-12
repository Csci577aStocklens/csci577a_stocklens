import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api';
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          // Store token in localStorage
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }
  
  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { 
      username, 
      email, 
      password 
    });
  }
  
  logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }
}
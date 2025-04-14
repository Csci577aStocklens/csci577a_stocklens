import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get('/api/current-user').pipe(
      tap((response: any) => {
        if (response.success) {
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }
} 
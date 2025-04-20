import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockRecommendation {
  symbol: string;
  logo: string;
  industry: string;
  performance: number;
}

export interface RecommendationsResponse {
  watchlist: StockRecommendation[];
  recommendations: { [industry: string]: StockRecommendation[] };
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = '/api'; // Base URL for your API
  
  constructor(private http: HttpClient) { }
  
  getRecommendations(userId: string): Observable<RecommendationsResponse> {
    return this.http.get<RecommendationsResponse>(`${this.apiUrl}/recommendations/${userId}`);
  }
  
  getWatchlist(userId: string): Observable<StockRecommendation[]> {
    return this.http.get<StockRecommendation[]>(`${this.apiUrl}/watchlist/${userId}`);
  }
  
  // You can add more methods here as needed for other API endpoints
}
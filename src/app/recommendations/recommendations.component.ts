import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Output, EventEmitter } from '@angular/core';



interface StockRecommendation {
  symbol: string;
  logo: string;
  industry: string;
  performance: number;
}

@Component({
  selector: 'app-recommendations',
  template: `
    <div *ngIf="srched != 1" class="recommendations-container">
  <div *ngIf="isLoading" class="loading-container">
    <div class="loading-content">
      <mat-spinner [diameter]="30"></mat-spinner>
      <p class="loading-text">Grabbing the best stocks for you</p>
    </div>
  </div>


      <div *ngIf="!isLoading && recommendations">
        <h5 class="recommendations-title">Best Picks for You</h5>

        <div class="industry-columns">
          <div *ngFor="let industry of getIndustries()" class="industry-column">
            <h4 class="industry-title">{{ industry }}</h4>
            <div class="stocks-vertical-list">
              <div 
                *ngFor="let stock of getStocksByIndustry(industry)" 
                class="stock-card" 
                (click)="selectStock(stock.symbol)">
                
                <div class="stock-logo">
                  <img *ngIf="stock.logo" [src]="stock.logo" alt="Company Logo">
                  <div *ngIf="!stock.logo" class="stock-icon">{{ stock.symbol.charAt(0) }}</div>
                </div>

                <div class="stock-info">
                  <span class="stock-symbol">{{ stock.symbol }}</span>
                  <span 
                    class="stock-performance" 
                    [ngClass]="{ 'positive': stock.performance > 0, 'negative': stock.performance < 0 }">
                    <i *ngIf="stock.performance > 0" class="bi bi-arrow-up-right"></i>
                    <i *ngIf="stock.performance < 0" class="bi bi-arrow-down-right"></i>
                    {{ stock.performance.toFixed(2) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recommendations-container {
      margin-top: 24px;
      width: 100%;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 16px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px 0;
    }
    
    .recommendations-title {
      font-size: 2rem;
      margin-bottom: 24px;
      font-weight: 600;
      text-align: center;
      font-family: 'GeistMono', ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Liberation Mono, DejaVu Sans Mono, Courier New, monospace !important;
    }
    
    .industry-section {
      margin-bottom: 32px;
    }
    
    .industry-title {
      font-size: 1.5rem;
      margin-bottom: 16px;
      font-weight: 500;
      color: #6c6f85;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .stocks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .stock-card {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 2px 8px 0 rgba(108,111,133,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .stock-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px 0 rgba(108,111,133,0.15);
    }
    
    .stock-logo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    
    .stock-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .stock-icon {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #6c6f85;
      color: white;
      font-weight: bold;
    }
    
    .stock-info {
      display: flex;
      flex-direction: column;s
    }
    
    .stock-symbol {
      font-weight: 600;
      font-size: 1rem;
    }
    
    .stock-performance {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .positive {
      color: #22c55e;
    }
    
    .negative {
      color: #ef4444;
    }
      .recommendations-container {
  padding: 20px;
}

.industry-columns {
  display: flex;
  flex-direction: row;
  gap: 24px;
  overflow-x: auto;
}

.industry-column {
  min-width: 220px;
  display: flex;
  flex-direction: column;
  background: #f8f9fb;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.industry-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
}

.stocks-vertical-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stock-card {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.stock-card:hover {
  transform: scale(1.03);
}

.stock-logo img {
  width: 32px;
  height: 32px;
}

.stock-icon {
  width: 32px;
  height: 32px;
  background-color: #ccc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.stock-info {
  display: flex;
  flex-direction: column;
}

.stock-symbol {
  font-weight: bold;
}

.stock-performance.positive {
  color: green;
}

.stock-performance.negative {
  color: red;
}


.recommendations-title {
  font-size: 1.25rem; /* smaller than before */
  margin: 32px 0 24px 0; /* more top margin to push it away from search */
  font-weight: 500;
  text-align: center;
  font-family: 'GeistMono', ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Liberation Mono, DejaVu Sans Mono, Courier New, monospace !important;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh; /* or 100vh if you want full viewport height */
  width: 100%;
}



.loading-content {
  display: flex;
  flex-direction: column;
  align-items: right;
  gap: 10px; /* space between spinner and text */
}

.loading-text {
  margin: 0;
  font-size: 16px;
  color: #666;
}



  `]
})
export class RecommendationsComponent implements OnInit {
  @Output() stockSelected = new EventEmitter<string>();

selectStock(symbol: string) {
  this.stockSelected.emit(symbol);
}


  @Input() srched: number = 0;
  isLoading: boolean = true;
  recommendations: { [industry: string]: StockRecommendation[] } = {};
  userId: string = '1'; // Default user ID for demonstration

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getCurrentUserAndFetchRecommendations();
  }
  
  getCurrentUserAndFetchRecommendations(): void {
    this.http.get<any>('http://localhost:5001/api/current-user').subscribe(
      (userData) => {
        this.userId = userData?.user.email || 'test@google.com';
        this.fetchRecommendations();
      },
      (error) => {
        console.error('Error fetching current user:', error);
        this.userId = 'test@google.com';
        this.fetchRecommendations(); // fallback fetch with default
      }
    );
  }
  

  fetchRecommendations(): void {
    this.isLoading = true;
    const encodedUserId = encodeURIComponent(this.userId); // e.g. default@example.com → default%40example.com
    this.http.get<any>(`http://localhost:5001/recommendations/${encodedUserId}`, { withCredentials: true }).subscribe(
      (data) => {
        this.recommendations = data.recommendations;
        this.isLoading = false;
        console.log('Recommendations:', this.recommendations);
        
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
        this.isLoading = false;
      }
    );
  }

  getIndustries(): string[] {
    return Object.keys(this.recommendations).sort();
  }

  getStocksByIndustry(industry: string): StockRecommendation[] {
    return this.recommendations[industry].sort((a, b) => b.performance - a.performance);
  }

  setStock(symbol: string): void {
    // This method should be implemented in your parent component
    // and passed as an input to this component
    window.dispatchEvent(new CustomEvent('setStock', { detail: symbol }));
  }
}


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DetailsComponent } from './details/details.component';
import {Routes, RouterModule} from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
//import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ShareddataService } from './shareddata.service';
import { ChatComponent } from './chat/chat.component';

import { StockService } from './services/stock.service';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { SafeHtmlPipe } from './safe-html.pipe';


const appRoutes: Routes = [

  {path: '', component: SearchComponent}, 
  {path:'search', component: SearchComponent},
  {path:'search/:id', component: SearchComponent},
  {path:'Watchlist', component: WatchlistComponent},
  {path:'Portfolio', component: PortfolioComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: 'recommendations', component: RecommendationsComponent}, // Add this line for recommendations route
  {path: 'recommendations/:id', component: RecommendationsComponent}, // Add this line for recommendations route with id

  ]

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    DetailsComponent,
    WatchlistComponent,
    PortfolioComponent,
    ChatComponent,
    RecommendationsComponent,
    SafeHtmlPipe
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgbModule,
    HttpClientModule,

  ],
  providers: [    
    //provideClientHydration(),
    provideAnimationsAsync(),
    ShareddataService,
    StockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

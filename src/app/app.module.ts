import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
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
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './interceptors/auth.interceptor';
//import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ShareddataService } from './shareddata.service';


const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: SearchComponent, canActivate: [authGuard] },
    {path:'search', component: SearchComponent},
  {path:'search/:id', component: SearchComponent},
  {path:'Watchlist', component: WatchlistComponent},
  {path:'Portfolio', component: PortfolioComponent},
  {path: 'details/:id', component: DetailsComponent},

  ]

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    DetailsComponent,
    WatchlistComponent,
    PortfolioComponent,
    LoginComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgbModule ,
    HttpClientModule
  ],
  providers: [    
    //provideClientHydration(),
    provideAnimationsAsync(),
    ShareddataService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

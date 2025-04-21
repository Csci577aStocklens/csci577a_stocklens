import { Component,ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { HttpClient } from '@angular/common/http';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'stck';
  ticker_app="F";
  currentUser: any = null;

  // Source : https://blog.angular-university.io/angular-viewchild/
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;
	@ViewChild(WatchlistComponent) watchComponent: WatchlistComponent | undefined;
	@ViewChild(PortfolioComponent) portfolioComponent: PortfolioComponent | undefined;

	clickedbutton: string = "";
  isUserMenuOpen: boolean = false;
	static buttonId: any;
  showwhatcomp: Number=1;
  constructor(private http: HttpClient, private userService: UserService) {
		this.button('srch');
	}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      (response) => {
        if (response.success) {
          this.currentUser = response.user;
          console.log('Current user:', response.user);
        } else {
          console.error('Error fetching current user:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );

    this.userService.currentUser$.subscribe(
      user => {
        if (user && user.success) {
          this.currentUser = user.user;
        }
      }
    );
  }

  ngAfterViewInit() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          navbar.classList.add('navbar-shadow');
        } else {
          navbar.classList.remove('navbar-shadow');
        }
      });
    }
  }

  button(str: string) {
    this.clickedbutton = str;
    if (str === 'srch') {
      this.showwhatcomp = 1;
      this.searchComponent?.get_holdings();
    }
    else if (str === 'wchlst') {
      this.showwhatcomp = 2;
      this.watchComponent?.ngOnInit();
    }
    else if (str === 'prtfl') {
      this.showwhatcomp = 3;
      this.portfolioComponent?.ngOnInit();
    }
    else if (str === 'chat') {
      this.showwhatcomp = 4;
      
    }
  }

  // Source : https://angular.io/api/core/EventEmitter
  // Source : https://stackoverflow.com/questions/46489081/emit-search-input-value-to-child-components-in-angular-2
  // Source : https://github.com/angular/angular/issues/9717
  // Source : https://ultimatecourses.com/blog/component-events-event-emitter-output-angular-2
  // This function is for calling from watchlist and setting the ticker and showing it in search page
	wtchlstcall(tkr:string){
    this.searchComponent.setStock(tkr);
		this.button('srch');
	}

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

}

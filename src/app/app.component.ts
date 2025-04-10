import { Component,ViewChild } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stck';
  ticker_app="F";

  // Source : https://blog.angular-university.io/angular-viewchild/
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;
	@ViewChild(WatchlistComponent) watchComponent: WatchlistComponent | undefined;
	@ViewChild(PortfolioComponent) portfolioComponent: PortfolioComponent | undefined;

	clickedbutton: string = "";
	static buttonId: any;
  showwhatcomp: Number=1;
  constructor(){
		this.button('srch');
	}

  button(buttonId: string) {
		this.clickedbutton = buttonId;
    this.showwhatcomp=1;
		if (buttonId === 'srch') {
      this.showwhatcomp=1;
		} else if (buttonId === 'wchlst') {
      this.showwhatcomp=2;
      this.watchComponent?.ngOnInit();
		} else if (buttonId === 'prtfl') {
      this.showwhatcomp=3;
      this.portfolioComponent?.ngOnInit();
      //this.portfolioComponent?.constructor();
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

}
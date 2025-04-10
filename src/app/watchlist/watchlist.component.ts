import { Component,EventEmitter, Output,ElementRef, ViewChild,} from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {
  empty=0;
  watch:any;
  ticker:any;
  dt:any;
  TickerCtrl= new FormControl();  
  comp_d :any;
  emp=1;
  summary:any;
  market_op_cl=0; //0 open 1 close
  clr="red";
  info_pnt=0;
  info_s_pnt=0;
  summaries: any[] = [];
  closeResult:any;
  
  @Output() wtchlstcall = new EventEmitter();

  constructor( private modalService: NgbModal){
/*
      //comp_ear
      axios.get("http://localhost:5001/stocks_watch/").then(response => {
        this.watch = response.data; //JSON.stringify(response.data);
        console.log("watch ",this.watch);
        this.ticker=this.watch;
        if(this.watch.length==0){
          this.empty=1;
        }
        else{
          this.empty=0;
        }
        console.log("tikcer",this.ticker);
        //this.watch.forEach( (tckr : any )=> {
        for (let i = 0; i < this.watch.length; i++) {
          let tckr=this.watch[i];
          console.log("tkcr",tckr);
        axios.get("http://localhost:5001/summary_info?name="+tckr.ticker).then(response => {
          this.summary = response.data; //JSON.stringify(response.data);
          console.log("summa",this.summary);
          
          const smr= response.data;
					
          this.watch[i].c= smr.c;
          this.watch[i].d=smr.d;
					this.watch[i].dp= smr.dp;


          this.summaries.push(response.data);
          const dateObject = new Date(this.summary.t * 1000); // Multiply by 1000 to convert from seconds to milliseconds
          const formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");
          this.dt=formattedDate
          console.log(this.dt);
          const currentTimestampUnix = Math.floor(Date.now() / 1000);
          console.log(this.dt);
          const timeDifferenceSeconds = currentTimestampUnix - this.summary.t;
          
          if (timeDifferenceSeconds > 300) {
              this.market_op_cl=1;
          } else {
            this.market_op_cl=0;
    
          }
          if(this.market_op_cl==0){
            this.clr="green";
          }
  
          this.info_pnt=1;
          console.log("sumarries",this.summaries);
        })
        .catch(error => {
          console.log(error);
        });
      };
      
      })
      .catch(error => {
        console.log(error);
      });*/
  }

  ngOnInit(){

    //comp_ear
    axios.get("http://localhost:5001/stocks_watch/").then(response => {
      this.watch = response.data; //JSON.stringify(response.data);
      console.log("watch ",this.watch);
      this.ticker=this.watch;
      if(this.watch.length==0){
        this.empty=1;
      }
      else{
        this.empty=0;
      }
      console.log("tikcer",this.ticker);
      //this.watch.forEach( (tckr : any )=> {
      for (let i = 0; i < this.watch.length; i++) {
        let tckr=this.watch[i];
        console.log("tkcr",tckr);
      axios.get("http://localhost:5001/summary_info?name="+tckr.ticker).then(response => {
        this.summary = response.data; //JSON.stringify(response.data);
        console.log("summa",this.summary);
        
        const smr= response.data;
        
        this.watch[i].c= smr.c;
        this.watch[i].d=smr.d;
        this.watch[i].dp= smr.dp;


        this.summaries.push(response.data);
        const dateObject = new Date(this.summary.t * 1000); // Multiply by 1000 to convert from seconds to milliseconds
        const formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");
        this.dt=formattedDate
        console.log(this.dt);
        const currentTimestampUnix = Math.floor(Date.now() / 1000);
        console.log(this.dt);
        const timeDifferenceSeconds = currentTimestampUnix - this.summary.t;
        
        if (timeDifferenceSeconds > 300) {
            this.market_op_cl=1;
        } else {
          this.market_op_cl=0;
  
        }
        if(this.market_op_cl==0){
          this.clr="green";
        }

        this.info_pnt=1;
        console.log("sumarries",this.summaries);
      })
      .catch(error => {
        console.log(error);
      });
    };
    
    })
    .catch(error => {
      console.log(error);
    });
}

	open_modal(content: any) {
    console.log("sds modal");
		this.modalService.open(content, {  centered: false});
    console.log("end");
	}

  setStock(tkr:any){
    this.wtchlstcall.emit(tkr);
  }
 
  delete(ticker: string){
    console.log(ticker,"deling");
    axios.delete("http://localhost:5001/stocks_watch/"+ticker).then(response => {
        console.log("deleted",ticker);
        axios.get("http://localhost:5001/stocks_watch/").then(response => {
          this.watch = response.data; //JSON.stringify(response.data);
          if(this.watch.length==0){
            this.empty=1;
          }
          else{
            this.empty=0;
            for (let i = 0; i < this.watch.length; i++) {
              let tckr=this.watch[i];
              console.log("tkcr",tckr);
            axios.get("http://localhost:5001/summary_info?name="+tckr.ticker).then(response => {
              this.summary = response.data; //JSON.stringify(response.data);
              console.log("summa",this.summary);
              
              const smr= response.data;
              
              this.watch[i].c= smr.c;
              this.watch[i].d=smr.d;
              this.watch[i].dp= smr.dp;
    
    
              this.summaries.push(response.data);
              const dateObject = new Date(this.summary.t * 1000); // Multiply by 1000 to convert from seconds to milliseconds
              const formattedDate = dateObject.toISOString().slice(0, 19).replace("T", " ");
              this.dt=formattedDate
              console.log(this.dt);
              const currentTimestampUnix = Math.floor(Date.now() / 1000);
              console.log(this.dt);
              const timeDifferenceSeconds = currentTimestampUnix - this.summary.t;
              
              if (timeDifferenceSeconds > 300) {
                  this.market_op_cl=1;
              } else {
                this.market_op_cl=0;
        
              }
              if(this.market_op_cl==0){
                this.clr="green";
              }
      
              this.info_pnt=1;
              console.log("sumarries",this.summaries);
            })
            .catch(error => {
              console.log(error);
            });
          };


          }
          console.log("watch ",this.watch);
          this.ticker=this.watch;
          console.log("tikcer",this.ticker);  
        })
        .catch(error => {
          console.log(error);
        });
  


      })
      .catch(error => {
        console.log(error);
      });


  }


}

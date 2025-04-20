import { Component,EventEmitter, Output,ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import { TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'highcharts';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  userName = ''; // Will be populated from cookie
  empty=0;
  balance=1500;
  protf:any;
  dt:any;
  ticker="";
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
  companyProfilesMap: { [key: string]: any } = {};  // Changed from array to map
  expandedStock: string | null = null;

  quantity=0;
  total=0.00;
  enable_buy=1;
  warning=0;
  enable_sell=1;
  warning_s=0;
  added_s=0;

  stocks_having=6;
  
  total_s=0;
  quantity_s=0;
  sold_s=0;
  c=0;
  name="";
  @Output() wtchlstcall = new EventEmitter();

  // Utility function to get cookie value by name
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return decodeURIComponent(match[2]);
    }
    return null;
  }

  constructor(private modalService: NgbModal) {
    // Fetch username from userData cookie
    const userDataCookie = this.getCookie('userData');
    if (userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie);
        this.userName = userData.name ? userData.name : 'Investor';
      } catch (e) {
        this.userName = 'Investor';
      }
    } else {
      this.userName = 'Investor';
    }
  }

  ngOnInit(){
    axios.get("http://localhost:5001/balance/").then(response=>{
      this.balance=response.data.balance;
      console.log("success",this.balance);
    }).catch((err)=>{
      console.log("err fail",err);
      return;
    });

    axios.get("http://localhost:5001/portfolio/").then(response => {
        this.summaries=[];
        this.protf = response.data;
        this.companyProfilesMap = {};  // Reset the map
        console.log("protf ",this.protf);
        if(this.protf.length==0){
          this.empty=1;
        }
        else{
          this.empty=0;
        }
        for (let i = 0; i < this.protf.length; i++) {
          let tckr=this.protf[i];
          console.log("tkcr",tckr);
          
          // Fetch company profile data
          axios.get("http://localhost:5001/stockinfo?name="+tckr.ticker).then(response => {
            const profile = response.data;
            this.companyProfilesMap[tckr.ticker] = profile;  // Store by ticker instead of index
            console.log("profile", profile);
          }).catch(error => {
            console.log(error);
          });

          // Fetch summary info
          axios.get("http://localhost:5001/summary_info?name="+tckr.ticker).then(response => {
            this.summary = response.data;
            const smr=response.data;
            console.log("summa",tckr,this.summary);
            this.summaries.push(smr);
            this.protf[i].avg = this.protf[i].total / this.protf[i].qnt;
            this.protf[i].c = smr.c;
            this.protf[i].d = smr.d;  // Daily change value
            this.protf[i].dp = smr.dp;  // Daily change percentage
            this.info_pnt=1;
            console.log("sumarries",this.summaries);
          }).catch(error => {
            console.log(error);
          });
        }
    }).catch(error => {
      console.log(error);
    });
  
  }

// bookmark - yellow if there in watchlist
Add_portfolio(p:any){
  this.balance=this.balance - (this.quantity*p);
  this.added_s=1;
  this.sold_s=0;
  setTimeout(() => {
    this.added_s = 0;
  }, 5001);
  console.log(this.balance,"bana");
  axios.post("http://localhost:5001/balance/",{
      "balance": -1 * this.quantity*p
    }).then((res)=>{

      console.log('bllsls',this.balance);

      axios.post("http://localhost:5001/portfolio/",{
        "ticker":this.ticker,
        "name":this.name,
        "qnt": this.quantity ,
        "total": this.quantity*p 
      }).then((res)=>{
      console.log("success");


      axios.get("http://localhost:5001/portfolio/").then(response => {
        this.summaries=[];
        this.protf = response.data; //JSON.stringify(response.data);
        console.log("protf ",this.protf);
//        this.protf.forEach( (tckr : any )=> {
        for (let i = 0; i < this.protf.length; i++) {
          let tckr=this.protf[i];
          console.log("tkcr",tckr);
          axios.get("http://localhost:5001/summary_info?name="+tckr.ticker).then(response => {
              this.summary = response.data; //JSON.stringify(response.data);
              console.log("summa",this.summary);
              const smr=response.data;
              this.protf[i].c=smr.c;
              this.protf[i].avg= this.protf[i].total / this.protf[i].qnt
              this.protf[i].change= smr.c- this.protf[i].avg;
              this.info_pnt=1;
              this.summaries.push(response.data);
              console.log("sumarries",this.summaries);
              axios.get("http://localhost:5001/balance/").then(response=>{
                this.balance=response.data.balance;
                console.log("success lower",this.balance);
                this.quantity=0;
                this.total=0.00;
                console.log("bala",this.balance);
              }).catch((err)=>{
                console.log("err fail",err);
                return;
              });
        })
        .catch(error => {
          console.log(error);
        });
      };

      })
      .catch(error => {
        console.log(error);
      });
      
  }).catch((err)=>{
    console.log("err fail",err);
    return;
  });
      console.log("success");
  }).catch((err)=>{
    console.log("err fail",err);
    return;
  });

  
  //add to DB
  // subract from DB and stor it in DB
  //modal.close('Save');
  //this.added_s=1;
  //this.sold_s=0;

  
      console.log("buyed");

}

sell_portfolio(p:any){
  this.balance = this.balance + (this.quantity_s * p);
  this.sold_s = 1;
  this.added_s = 0;
  setTimeout(() => {
    this.sold_s = 0;
  }, 5001);
  this.stocks_having -= this.quantity_s;
  
  const sellStock = () => {
    axios.post("http://localhost:5001/balance/", {
      "balance": this.quantity_s * p
    }).then((res) => {
      if (this.stocks_having > 0) {
        return axios.post("http://localhost:5001/portfolio/sub", {
          "ticker": this.ticker,
          "name": this.name,
          "qnt": this.quantity_s,
          "total": this.quantity_s * p
        });
      } else {
        return axios.delete("http://localhost:5001/portfolio/" + this.ticker);
      }
    }).then(() => {
      return this.refreshPortfolioData();
    }).catch((err) => {
      console.error("Error during sell operation:", err);
    });
  };

  sellStock();
}

closing(){
  this.quantity=0;
  this.total=0.00;
  this.total_s=0;
  this.quantity_s=0;
  this.enable_buy=1;
  this.warning=0;
  this.enable_sell=1;
  this.warning_s=0;

}
changeSell(p:any){
  this.total_s=this.quantity_s*p;
  if(this.quantity_s<=0){
    this.enable_sell=1;
  }
  else{
    if(this.stocks_having<this.quantity_s){
      this.enable_sell=1;
      this.warning_s=1;
    }
    else{
      this.enable_sell=0;
      this.warning_s=0;
    }
  }
}
setStock(tkr:any){
  console.log("setST Prt",tkr);
  this.wtchlstcall.emit(tkr);
}

cloing_cardB(){
  this.added_s=0;
  }
cloing_cardS(){
  this.sold_s=0;
}

open(content: any,item:any) {
  console.log(item);
  this.ticker=item.ticker;
  let summary2:any;
  let pf:any;
  this.name=item.name;
  axios.get("http://localhost:5001/portfolio").then(response => {
          pf = response.data; //JSON.stringify(response.data);
          const isPresent = pf.find((obj:any) => obj.ticker == this.ticker);
            console.log(isPresent,"isPresent");
            if (isPresent){ 
              this.stocks_having= isPresent.qnt;
            }
            else{
              this.stocks_having=0
            }
            axios.get("http://localhost:5001/summary_info?name="+item.ticker).then(response => {
          summary2 = response.data; //JSON.stringify(response.data);
          this.c=summary2.c
          this.modalService.open(content, {  centered: false});
          console.log("end");
}).catch(error=>{console.log(error)});
    
}).catch(error=>{console.log(error)});
 
  
 
}
changeBuy(p:any){
  this.total=this.quantity*p;
  console.log(this.total,this.enable_buy,this.quantity<=0);
  if (this.quantity<=0){
    this.enable_buy=1;
  }
  else{
  if(this.total>this.balance){
    this.enable_buy=1;
    this.warning=1;
  }
  else{
    this.enable_buy=0;
    this.warning=0;
  }
}
}

// Add this new method to handle portfolio refresh
refreshPortfolioData() {
  return axios.get("http://localhost:5001/portfolio/").then(response => {
    this.protf = response.data;
    this.empty = this.protf.length === 0 ? 1 : 0;
    
    if (this.protf.length > 0) {
      const promises = this.protf.map((tckr: any, index: number) => {
        return axios.get("http://localhost:5001/summary_info?name=" + tckr.ticker)
          .then(response => {
            const smr = response.data;
            this.protf[index] = {
              ...this.protf[index],
              c: smr.c || 0,
              d: smr.d || 0,
              dp: smr.dp || 0,
              avg: this.protf[index].total / this.protf[index].qnt || 0,
              change: (smr.c || 0) - (this.protf[index].total / this.protf[index].qnt || 0)
            };
          });
      });

      return Promise.all(promises).then(() => {
        return axios.get("http://localhost:5001/balance/");
      }).then(response => {
        this.balance = response.data.balance;
        this.quantity_s = 0;
        this.total_s = 0.00;
        this.info_pnt = 1;
      });
    }
    return Promise.resolve();
  });
}

toggleStockExpansion(ticker: string) {
  if (this.expandedStock === ticker) {
    this.expandedStock = null;
  } else {
    this.expandedStock = ticker;
  }
}

}
import { Component,ElementRef, ViewChild,OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import * as Highcharts from "highcharts/highstock";
import IndicatorsAll from "highcharts/indicators/indicators-all";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareddataService } from '../shareddata.service';
import { AppComponent } from '../app.component';

// Set global Highcharts theme
Highcharts.setOptions({
  tooltip: {
    backgroundColor: 'black',
    style: {
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  },
  chart: {
    style: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px'
    }
  },
  title: {
    style: {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  xAxis: {
    labels: {
      style: {
        fontSize: '12px'
      }
    },
    gridLineWidth: 0
  },
  yAxis: {
    labels: {
      style: {
        fontSize: '12px'
      }
    },
    gridLineWidth: 0
  }
});

IndicatorsAll(Highcharts);

// portfolio total price - done
// watchlist css -done
// highcharts grouping remove - done
// watchlist click event- done
// nav tab - done
// cite app.htxml and ts- done
// insights- done
// charts- done
// news tab -done
// summary - done
// routing - done
// modal of buy and sell- done
// houry data - dates current and prev - done
// errors- done
// time locale- done
// market open close- done
// hrs charts market ope close color based on data and time - done
// alerts - done
// mongodb atlas- done
// navbar -bootdtrap stacking - done

// search page - carasoul
// hrs chart date
// watchlist-bst - colms in same scolm
// portfolio-bst -colms in same scolm
// deploy
// watchlist  - update 15 sec ???
// time under summary - current or summary.t??

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit  {
  //@ViewChild('btn1') btn1!: ElementRef;
  ngOnInit() {
    // Initial call to set the time immediately
    // Schedule updates every 15 seconds
    console.log(this.shareddataService.ticker,"this.shareddataService.ticker",this.shareddataService.get(),"get");
    setInterval(() => {
      this.updateTime();
    }, 15001); // 15 seconds
  }

  ticker = "";
  displayTicker = ""; // New variable for display purposes
  dt:any;
  portf:any;
  TickerCtrl= new FormControl();  
  srched =0;
  comp_d :any;
  emp=1;
  emp1=1;
  loading=false;
  auto_cmp :any[]=[];
  summary:any;
  market_op_cl=0; //0 open 1 close
  clr="red";
  info_pnt=0;
  info_s_pnt=0;
  info_ch_pnt=0;
  infor_nws_pnt=0;
  recommendation:any;
  company_desc:any;
  news:any;
  fil_news:any;
  insights:any;//insights
  ins_tot:any;
  ins_pos:any;
  ins_neg:any;
  ins_ch_tot:any;
  ins_ch_pos:any;
  ins_ch_neg:any;
  comp_ear:any;
  charts_d:any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartOptions1: Highcharts.Options = {};
  chartSummaryOptions: Highcharts.Options = {};
  //Highcharts1: typeof Highcharts1 = Highcharts1;
  chartOptions2: Highcharts.Options = {};
  recom:any;
  model_item:any;
  model_date:any;
  charts_hoursly_data:any;
  model_item_summary="";
  peers:any;
  hrdt2="";
  bookmarked=0;// 0 - if not bookmarked
  hrdt1="";
  up_ar=0;
  watch:any;
  balance=250010;
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
  has_portf=0;
  name="";
  protf:any;
  summaries: any[] = [];
  globalVariable:any;
  added_bk=0;
  clsalert=1;
  sold_bk=0;
  username: string = 'YourUsername'; // Will be set from cookie

  // Utility function to get cookie value by name
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return decodeURIComponent(match[2]);
    }
    return null;
  }

constructor(private modalService: NgbModal, private shareddataService:ShareddataService, private appComponent: AppComponent ){
  if(this.shareddataService.ticker!=""){
    this.ticker=this.shareddataService.ticker;  
  }

  // Fetch username from userData cookie
  const userDataCookie = this.getCookie('userData');
  if (userDataCookie) {
    try {
      const userData = JSON.parse(userDataCookie);
      this.username = userData.name ? userData.name : 'Guest';
    } catch (e) {
      this.username = 'Guest';
    }
  } else {
    this.username = 'Guest';
  }

  console.log("this.ticker",this.ticker,this.shareddataService.ticker,this.shareddataService.get(),"get",this.appComponent.ticker_app);

}
close_err(){
  this.clsalert=1;


}

updateTime(){
  this.globalVariable=this.shareddataService.globalVariable;

  if (this.ticker!=""){
    if(this.market_op_cl==0){
  axios.get("http://localhost:5001/summary_info?name="+this.ticker).then(response => {
    this.summary = response.data; //JSON.stringify(response.data);
    console.log("summa",this.summary);
    if (Object.keys(this.comp_d).length==0){
      this.emp=0;
      this.clsalert=0;
    }
    else{
      this.emp=1;
      this.clsalert=1;
    }

    const dateObject = new Date();//new Date(this.summary.t * 1000); // Multiply by 1000 to convert from seconds to milliseconds
    const formattedDate = dateObject.toISOString().slice(0,10)+" "+dateObject.toLocaleString('it-IT').split(",")[1];   //.toISOString().slice(0, 19).replace("T", " ");
    this.dt=formattedDate
    console.log("this.dt",this.dt);

    const currentTimestampUnix = Math.floor(Date.now() / 1000);
    const timeDifferenceSeconds = currentTimestampUnix - this.summary.t;
    
    if (timeDifferenceSeconds > 300) {
        this.market_op_cl=1;
    } else {
      this.market_op_cl=0;

    }
  })
    .catch(err=>{console.log(err)})
  }
  }
}

cloing_cardB(){
this.added_s=0;
}
cloing_cardS(){
this.sold_s=0;
}
cloing_cardBK(){
  this.added_bk=0;
  }
  cloing_cardSK(){
  this.sold_bk=0;
  }

// bookmark - yellow if there in watchlist
Add_portfolio(p:any){
  console.log(this.quantity,this.ticker);
  this.balance=this.balance - (this.quantity*p);
  this.added_s=1;
  this.sold_s=0;
  setTimeout(() => {
    this.added_s = 0;
  }, 5001);
  console.log(this.quantity);
  axios.post("http://localhost:5001/balance/",{
    "balance": -1 * this.quantity*p
  }).then((res)=>{

    console.log('bllsls',this.balance);

    axios.post("http://localhost:5001/portfolio/",{
      "ticker":this.ticker,
      "name":this.name,
      "qnt": this.quantity,
      "total": this.quantity*p
    }).then((res)=>{

    console.log("success");
    axios.get("http://localhost:5001/portfolio/").then(response => {
      this.protf = response.data; //JSON.stringify(response.data);
      console.log("protf ",this.protf);
      this.has_portf=1;
      for (let i = 0; i < this.protf.length; i++) {
        let tckr=this.protf[i];
        console.log("tkcr",tckr);
        axios.get("http://localhost:5001/summary_info?name="+tckr.ticker).then(response => {
            this.info_pnt=1;
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


// buy and sell buttins after buying and selling

  //this.added_s=1;
  //this.sold_s=0;
}

sell_portfolio(p:any){
  this.balance=this.balance + (this.quantity_s*p);
  this.sold_s=1;
  setTimeout(() => {
    this.sold_s = 0;
  }, 5001);
  this.added_s=0;
  this.stocks_having-=this.quantity_s
  if (this.stocks_having>0){
    // increase the sold 
    axios.post("http://localhost:5001/balance/",{
        "balance": this.quantity_s*p
      }).then((res)=>{
  
        console.log('bllsls',this.balance);
  
        axios.post("http://localhost:5001/portfolio/sub",{
          "ticker":this.ticker,
          "name":this.name,
          "qnt": this.quantity_s ,
          "total":this.quantity_s*p 
        }).then((res)=>{
        console.log("success");
        axios.get("http://localhost:5001/balance/").then(response=>{
        this.balance=response.data.balance;
                  console.log("success lower",this.balance);
                  this.quantity_s=0;
                  this.total_s=0.00;
                  this.has_portf=1;
                  console.log("bala",this.balance);
                
                }).catch((err)=>{
                  console.log("err fail",err);
                  return;
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
    }
    else{
      axios.post("http://localhost:5001/balance/",{
        "balance": this.quantity_s*p
      }).then((res)=>{
    
        console.log('bllsls',this.balance);
      axios.delete("http://localhost:5001/portfolio/"+this.ticker).then(response => {
          console.log("deleted",this.ticker);
  
          axios.get("http://localhost:5001/balance/").then(response=>{
                    this.balance=response.data.balance;
                    console.log("success lower",this.balance);
                    this.quantity_s=0;
                    this.total_s=0.00;
                    this.has_portf=0;
                    console.log("bala",this.balance);
                  
                  }).catch((err)=>{
                    console.log("err fail",err);
                    return;
                  });
              
        })
        .catch(error => {
          console.log(error);
        });
      }).catch((err)=>{
        console.log("err fail",err);
        return;
      });
    }


  //this.has_stocks=0.....
  // increase the sold 
// change stock having
  

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
open(content: any) {
//  this.modalService.open(content, {  centered: false});
  let pf:any;
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
          this.modalService.open(content, {  centered: false});
    
}).catch(error=>{console.log(error)});
 
  
  console.log("end");
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

open_modal(content: any,item:any) {
  console.log("sds modal");
  console.log(item);
  this.model_item=item;
  const dateObject = new Date(item.datetime*1000); // Multiply by 1000 to convert from seconds to milliseconds
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Get the components of the date
  const day = dateObject.getDate();
  const month = months[dateObject.getMonth()];
  const year = dateObject.getFullYear();
  
  // Format the date
  const formattedDate = `${month} ${day}, ${year}`;
  
  this.model_date=formattedDate

  this.model_item_summary = item.summary.slice(0, -5);

  this.modalService.open(content, {  centered: false});
  console.log("end");
}



  clrscr(){
    console.log("clrscr",this.ticker);
    this.ticker="";
    this.displayTicker = ""; // Clear display ticker
    this.srched=0;
    this.emp=1;
    this.clsalert=1;
    this.emp1=1;
  }

  info(){
    this.info_pnt=1;
    this.info_s_pnt=0;
    this.info_ch_pnt=0;
    this.infor_nws_pnt=0;

  }
  info_s(){
    this.info_pnt=0;
    this.info_s_pnt=1;
    this.info_ch_pnt=0;
    this.infor_nws_pnt=0;

    const filteredArray = this.news.filter((o:any) => o.headline !== '' && o.image !== '');
    this.fil_news=filteredArray.slice(0, 20);
    console.log(this.fil_news);

  }
  info_ch(){
    this.info_pnt=0;
    this.info_s_pnt=0;
    this.info_ch_pnt=1;
    this.infor_nws_pnt=0;
    let ohlc = [];
    let volume = [];
    console.log("this.charts",this.charts_d)
    let data=this.charts_d.results;
    const dataLength = this.charts_d.results.length;
    console.log("sdsdsc charts",this.charts_d.results,data,dataLength);
    // set the allowed units for data grouping 

    const groupingUnits : [string, number[]][] = [
      ['week',[1]],
      ['month',[1,2,3,4,5,6]]
      ];
    for (let i = 0; i < dataLength; i += 1) {
      ohlc.push([
          data[i]["t"], // the date
          data[i]["o"], // open
          data[i]["h"], // high
          data[i]["l"], // low
          data[i]["c"] // close
      ]);

      volume.push([
          data[i]['t'], // the date
          data[i]['v'] // the volume
      ]);
  }

  console.log("volume",volume);
  console.log("ohc",ohlc);
  this.chartOptions2={
    rangeSelector: {
      selected: 2
  },

  title: {
      text: this.charts_d.ticker+' Historical'
  },

  subtitle: {
      text: 'With SMA and Volume by Price technical indicators'
  },

  yAxis: [{
      startOnTick: false,
      endOnTick: false,
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
          enabled: true
      },
      gridLineWidth: 0
  }, {
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2,
      gridLineWidth: 0
  }],

  tooltip: {
      backgroundColor: '#f8fafc',
      style: {
          backgroundColor: '#f8fafc'
      },
      split: true
  },
  series: [{
      type: 'candlestick',
      name: this.charts_d.ticker,
      id: 'aapl',
      zIndex: 2,
      data: ohlc
  }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: volume,
      yAxis: 1
  }, {
    type: 'vbp',
    linkedTo: 'aapl',
    params: {
        volumeSeriesID: 'volume'
    },
    dataLabels: {
        enabled: false
    },
    zoneLines: {
        enabled: false
    },
    color:"red" 
}, {
    type: 'sma',
    linkedTo: 'aapl',
    zIndex: 1,
    marker: {
        enabled: false
    },
    color:"red"
    }
    ]
  };
  this.info_pnt=0;
  this.info_s_pnt=0;
  this.info_ch_pnt=1;
  this.infor_nws_pnt=0;


  }

  info_inf(){
    this.info_pnt=0;
    this.info_s_pnt=0;
    this.info_ch_pnt=0;
    this.infor_nws_pnt=1;
    this.ins_tot=0;
    this.ins_pos=0;
    this.ins_neg=0;
    this.ins_ch_tot=0;
    this.ins_ch_pos=0;
    this.ins_ch_neg=0;
    
    console.log("inf_nwsssss");
    this.insights['data'].forEach( (element:any) => {
      //console.log(element);
      this.ins_tot+=element['mspr'];
      if(element['mspr']>=0){
        this.ins_pos+=element['mspr']
      }
      else{
        this.ins_neg+=element['mspr']
      }

      this.ins_ch_tot+=element['change'];
      if(element['change']>=0){
        this.ins_ch_pos+=element['change']
      }
      else{
        this.ins_ch_neg+=element['change']
      }


    });

    this.ins_neg=-1 * this.ins_neg;
    const newArray = this.comp_ear.map((obj:any) => [obj.period , obj.surprise]);
    const actual = this.comp_ear.map((obj:any) => obj.actual);
    const estimated = this.comp_ear.map((obj:any) => obj.estimate);
    
    
    const strong_b = this.recom.map((obj:any) => obj.strongBuy);
    const buy = this.recom.map((obj:any) => obj.buy);
    const hold = this.recom.map((obj:any) => obj.hold);
    const sell = this.recom.map((obj:any) => obj.sell);
    const strong_sell = this.recom.map((obj:any) => obj.strongSell);
    const prd=this.recom.map((obj:any) => obj.period);
    
    this.chartOptions1={
      chart: {
        type: 'column',
        backgroundColor: '#f8fafc',

    },
    title: {
        text: 'Recommendation Trends',
    },
    xAxis: {
        categories: prd,//['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
        labels:{
          formatter: function () {
						return Highcharts.dateFormat('%Y-%m', Number(new Date(this.value)));
					}
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '# Analysis'
        },
        stackLabels: {
            enabled: false
        }
    },
    tooltip: {
        backgroundColor: '#f8fafc',
        style: {
            backgroundColor: '#f8fafc'
        },
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [
      {
        type: 'column',
        name: 'Strong Buy',
        data: strong_b,
        color:"#1a6334"
    }, 
    {
      type: 'column',
        name: 'Buy',
        data: buy,
        color:"#24af51"
    }, {
      type: 'column',
        name: 'Hold',
        data: hold,
        color:"#b07e28"
    },{
      type: 'column',
        name: 'Sell',
        data: sell,
        color:"#f26063"
    },{
      type: 'column',
        name: 'Strong Sell',
        data: strong_sell,
        color:"#752b2c"
    },
  
  
  ]



    };






    this.chartOptions={
      chart: {
        type: 'spline',
        backgroundColor: '#f8fafc',

    },
    title: {
        text: 'Historical EPS Surprises'
    },
    xAxis: {
        categories: newArray, //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            //'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        accessibility: {
            description: 'Months of the year'
        },
        labels: {
//          useHTML: true,
          format: '{value.0} <br/> Surprise:{value.1}'
      }
    },
    yAxis: {
        title: {
            text: 'Quaterly EPS'
        },
        labels: {
            format: '{value}'
        }
    },
    tooltip: {
        backgroundColor: '#f8fafc',
        style: {
            backgroundColor: '#f8fafc'
        },
        //crosshairs: true,
        shared: true
    },
    plotOptions: {
        spline: {
            marker: {
                radius: 4,
                lineColor: '#666666',
                lineWidth: 1
            }
        }
    },
    series: [{
      type: 'spline',
        name: 'Actual',
        marker: {
            symbol: 'square'
        },
        data: actual //[5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, {
           // y: 26.4,
        //}, 22.8, 17.5, 12.1, 7.6]

    }, {
      type: 'spline', // Add the type property here
        name: 'Estimate',
        marker: {
            symbol: 'diamond'
        },
        data:estimated 
    }]

    };

    

  }

  add_data(tkr :string,nm :string){
    axios.post("http://localhost:5001/stocks_watch/",{
      "ticker":tkr,
      "c_name": nm
    }).then((res)=>{
      console.log("success");
      this.bookmarked =1;
      this.added_bk=1;
      this.sold_bk=0;
      setTimeout(() => {
        this.added_bk = 0;
      }, 5001);

  }).catch((err)=>{
    console.log("err fail",err);
    return;
  });


  }

  delete_bookmark(tkr :string){

    axios.delete("http://localhost:5001/stocks_watch/"+tkr).then(response => {
      console.log("deleted",tkr);
      axios.get("http://localhost:5001/stocks_watch/").then(response => {
        this.watch = response.data; //JSON.stringify(response.data);
        console.log("watch ",this.watch);
        //this.ticker=this.watch;
        //console.log("tikcer",this.ticker);  
        this.bookmarked =0;
        this.sold_bk=1;
        this.added_bk=0;
        setTimeout(() => {
          this.sold_bk = 0;
        }, 5001);
      })
      .catch(error => {
        console.log(error);
      });



    })
    .catch(error => {
      console.log(error);
    });
  }

  search(){
    console.log(this.ticker.length,"sds",this.ticker.length==0);
    if (this.ticker.length==0){
      this.emp1=0;
      this.clsalert=0;
      console.log(this.emp1,"NO TICKER");
    }
    else{
    this.emp1=1;
    this.clsalert=1;
    this.emp=1;
    this.srched=1;
    this.loading=false;
    this.displayTicker = this.ticker.toUpperCase(); // Update display ticker only when search is performed

    this.info_pnt=1;
    this.info_s_pnt=0;
    this.info_ch_pnt=0;
    this.infor_nws_pnt=0;
    
    this.added_s=0;
    this.sold_s=0;
    this.added_bk=0;
    this.sold_bk=0;
    this.bookmarked=0;


//this.shareddataService.ticker=this.ticker;
this.shareddataService.set(this.ticker);
console.log("set stock this.shareddataService.ticker",this.shareddataService.ticker,this.shareddataService.get(),"get");
this.appComponent.ticker_app=this.ticker;
    console.log("search",this.ticker);
    //has_portf


        //peers
        axios.get("http://localhost:5001/peers?name="+this.ticker).then(response => {
          let res=response.data; 
          const filteredSuggestions = res.filter((item: any) => {
            return !item.includes('.');
          });
          this.peers = filteredSuggestions //JSON.stringify(response.data);
          console.log(this.peers);
        })
        .catch(error => {
          console.log(error);
        });
    

    axios.get("http://localhost:5001/balance/").then(response=>{
      this.balance=response.data.balance;
      console.log("success lower",this.balance);
      this.quantity=0;
      this.total=0.00;
      console.log("bala",this.balance);
      axios.get("http://localhost:5001/portfolio/").then(response=>{
      this.portf=response.data;
      const isPresent = this.portf.some((obj:any) => obj.ticker == this.ticker);
            console.log(isPresent,"isPresent");
            if (isPresent){ 
                this.has_portf =1;
              }
              else{
                this.has_portf =0;

              }
      console.log("success",this.balance);
      axios.get("http://localhost:5001/stocks_watch/").then(response => {
        this.watch = response.data; //JSON.stringify(response.data);
        const isPresent = this.watch.some((obj:any) => obj.ticker == this.ticker);
            console.log(isPresent,"isPresent");
            if (isPresent){ 
                this.bookmarked =1;
              }
        console.log("bkgm",this.bookmarked,this.watch);

    }).catch(error => {
      console.log(error);
    }); 
  }).catch((err)=>{
    console.log("err fail",err);
    return;
  });
  }).catch((err)=>{
    console.log("err fail",err);
    return;
  });

  //http://localhost:5001/portfolio/
  
    


    axios.get("http://localhost:5001/stockinfo?name="+this.ticker).then(response => {
      this.comp_d = response.data; //JSON.stringify(response.data);
      console.log(this.comp_d);
      if (Object.keys(this.comp_d).length==0){
        this.emp=0;
        this.clsalert=0;
      }
      else{
        this.emp=1;
        this.clsalert=1;

      }
      this.name=this.comp_d.name
   
    axios.get("http://localhost:5001/summary_info?name="+this.ticker).then(response => {
      this.summary = response.data; //JSON.stringify(response.data);
      console.log("summa",this.summary);
      const dateObject = new Date(this.summary.t * 1000); // Multiply by 1000 to convert from seconds to milliseconds
      
      const formattedDate = dateObject.toISOString().slice(0,10)+" "+dateObject.toLocaleString('it-IT').split(",")[1]; //dateObject.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour12: false });  //dateObject.toISOString().slice(0, 19).replace("T", " ");
      this.dt=  formattedDate
      
      if (Object.keys(this.comp_d).length==0){
        this.emp=0;
        this.clsalert=0;
      }
      else{
        this.emp=1;
        this.clsalert=1;
      }

      console.log("this.dt",this.dt);
      const currentTimestampUnix = Math.floor(Date.now() / 1000);
      const timeDifferenceSeconds = currentTimestampUnix - this.summary.t;
      
      if (timeDifferenceSeconds > 300) {
          this.market_op_cl=1;
      } else {
        this.market_op_cl=0;

      }
      if(this.market_op_cl==0){
        this.clr="green";
      }
      else{
        this.clr="red";
      }

      if(this.summary.d>0){
        this.clr="green";
      }
      else{
        this.clr="red";
      }

      this.info_pnt=1;
//peers- do write a function that atek tthe item and set the ticker symbol and call the searcg function

      //if (this.market_op_cl==0){ // open
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
        let day = String(currentDate.getDate()).padStart(2, '0');
        let formattedDate1 = year+"-"+month+"-"+day;
        this.hrdt1= formattedDate1;

        currentDate.setDate(currentDate.getDate() - 1);
        let yearPreviousDay = currentDate.getFullYear();
        let monthPreviousDay = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
        let dayPreviousDay = String(currentDate.getDate()).padStart(2, '0');
        let formattedPreviousDay = yearPreviousDay+"-"+monthPreviousDay+"-"+dayPreviousDay;
        this.hrdt2= formattedPreviousDay
     // }
      /*else{
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        // Extract year, month, and day
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
        let day = String(currentDate.getDate()).padStart(2, '0');
        let formattedDate = year+"-"+month+"-"+day;
        this.hrdt1= formattedDate;

        let currentDate1 = new Date();
        currentDate1.setDate(currentDate1.getDate() - 2);
        let yearPreviousDay = currentDate1.getFullYear();
        let monthPreviousDay = String(currentDate1.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
        let dayPreviousDay = String(currentDate1.getDate()).padStart(2, '0');
        let formattedPreviousDay = yearPreviousDay+"-"+monthPreviousDay+"-"+dayPreviousDay;
        this.hrdt2= formattedPreviousDay;
      }*/
      console.log(this.hrdt1,this.hrdt2,"dfdfd");
      // should do ourly charts
      console.log(this.hrdt1,this.hrdt2,"http://localhost:5001/hrs_stk?name="+this.ticker+"&dt1="+this.hrdt1+"&dt2="+this.hrdt2)
  
      axios.get("http://localhost:5001/hrs_stk?name="+this.ticker+"&dt1="+this.hrdt2+"&dt2="+this.hrdt1).then(response => {
     
      console.log("chart hrlu",response);  
     
      this.charts_hoursly_data = response.data; //JSON.stringify(response.data);
     
      console.log("this.charts_hoursly_data",this.charts_hoursly_data,this.charts_hoursly_data["results"]);
     
      let data=  this.charts_hoursly_data.results;
     
      let seriesData =[];
      console.log("dataa",data);
      for (let i = 0; i < data.length; i += 1) {
        seriesData.push([
          new Date(data[i]["t"]).getTime(), //.toLocaleString('it-IT'))
            data[i]["c"] 
        ]);
      }
      console.log("PST", new Date(data[data.length-1]["t"]).toLocaleString("it-IT") ,currentDate,formattedDate1);
      let p=new Date(data[0]["t"])
      console.log("seriesData",seriesData,p.getTime() );
      console.log(typeof seriesData[0][0] );
      this.chartSummaryOptions = {
        chart: {
          type: 'line',
          backgroundColor: '#f8fafc',
          style: {
            backgroundColor: '#f8fafc'
          },
          plotBackgroundColor: '#f8fafc'
        },
        title: {
            text: this.displayTicker + ' Hourly Price Variation',
          style: {
            color: 'black',
            fontSize: '14px', 
          },
        },
        xAxis: {
         type: 'datetime',
        },
        yAxis: {
           opposite: true,
         title: {
           text: '',
         },
       },
       legend: {
         enabled: false, 
        },
        series: [{
              type: 'line',
            name: this.ticker,
            data: seriesData,
            color: this.summary.d >= 0 ? 'green' : 'red',
            marker: {
              enabled: false, 
            },
            }],
      };

      
      })
      .catch(error => {
        console.log(error);
      });  

    })
    .catch(error => {
      console.log(error);
    });
  })
  .catch(error => {
    console.log(error);
  });

  console.log(this.ticker);

    
    

    //recommendation

    axios.get("http://localhost:5001/recom?name="+this.ticker).then(response => {
      this.recommendation = response.data; //JSON.stringify(response.data);
    })
    .catch(error => {
      console.log(error);
    });


    //insights
    axios.get("http://localhost:5001/insider?name="+this.ticker).then(response => {
      this.insights = response.data; //JSON.stringify(response.data);
      console.log("insights ",this.insights);
    })
    .catch(error => {
      console.log(error);
    });

    //charts_d
    axios.get("http://localhost:5001/charts_d?name="+this.ticker).then(response => {
      this.charts_d = response.data; //JSON.stringify(response.data);
      console.log("charts_d ",this.charts_d);
    })
    .catch(error => {
      console.log(error);
    });

    

    //recom
    axios.get("http://localhost:5001/recom?name="+this.ticker).then(response => {
      this.recom = response.data; //JSON.stringify(response.data);
      console.log("recom ",this.recom);
    })
    .catch(error => {
      console.log(error);
    });
    
    //comp_ear
    axios.get("http://localhost:5001/comp_ear?name="+this.ticker).then(response => {
      this.comp_ear = response.data; //JSON.stringify(response.data);
      console.log("comp_ear ",this.comp_ear);
    })
    .catch(error => {
      console.log(error);
    });
    

    //news
    axios.get("http://localhost:5001/news?name="+this.ticker).then(response => {
      this.news = response.data; //JSON.stringify(response.data);
    })
    .catch(error => {
      console.log(error);
    });



    }

  }
  setStock(st:any){
    this.info_pnt=1;
    this.info_s_pnt=0;
    this.info_ch_pnt=0;
    this.infor_nws_pnt=0;
    this.added_s=0;
    this.sold_s=0;
    this.added_bk=0;
    this.sold_bk=0;

    console.log(st);
    this.ticker=st.toUpperCase();
    this.displayTicker = this.ticker; // Update display ticker when stock is selected
    console.log("setSeach",this.ticker);
    this.search();
  }

  change(){
    // need to write for selected one
    console.log(this.ticker);
    if(this.ticker.length>=1){
      this.loading=true;
    axios.get("http://localhost:5001/autocomp?name="+this.ticker).then(response => {
      let res = response.data['result'];
      //console.log(res['result']);
      const filteredSuggestions = res.filter((item: any) => {
        return item.type === 'Common Stock' && !item.symbol.includes('.');
      });
      this.loading=false;
      this.auto_cmp=filteredSuggestions;
      console.log(this.comp_d);
    })
    .catch(error => {
      console.log(error);

    });
    }
    else{
      this.auto_cmp = [];
      //return Promise.resolve([]);
  
    }
  }


}

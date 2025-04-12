import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import * as Highcharts from "highcharts/highstock";
import IndicatorsAll from "highcharts/indicators/indicators-all";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

IndicatorsAll(Highcharts);
@Injectable({
  providedIn: 'root'
})
export class ShareddataService {
  globalVariable="sharedData";




  ticker="";
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
  balance=  -1; /////
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
  //globalVariable:any;
  added_bk=0;
  sold_bk=0;


  constructor(private modalService: NgbModal) { }
  set(tkr:any){
    this.ticker=tkr;
  }
  get(){
    return this.ticker;
  }
}

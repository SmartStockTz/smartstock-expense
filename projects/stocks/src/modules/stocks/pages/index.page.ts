import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StockState} from "../states/stock.state";

@Component({
  selector: 'app-stocks-index',
  template: `
    <mat-sidenav-container>
      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side': 'over'" [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="height: 100vh">
        <app-toolbar searchPlaceholder="Filter product" [heading]="'Stocks'"
                            [sidenav]="sidenav"></app-toolbar>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10" style="">
          <h1 style="margin-top: 16px">Go To</h1>
          <div class="d-flex flex-row flex-wrap">
            <div *ngFor="let page of pages" routerLink="{{page.link}}" style="margin: 5px; cursor: pointer">
              <mat-card matRipple
                        style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                  {{page.icon}}
                </mat-icon>
              </mat-card>
              <p>{{page.name}}</p>
            </div>
          </div>
          <h1>Summary</h1>
          <div class="d-flex flex-row flex-wrap">
<!--            <div class="container-fluid row" style="width: 100%">-->
              <app-total-products-summary style="margin: 5px 0;"
                                                 class="col-sm-11 col-md-6 col-lg-6 col-xl-6">
              </app-total-products-summary>
              <app-products-value-summary style="margin: 5px 0;"
                                                 class="col-sm-11 col-md-6 col-lg-6 col-xl-6">
              </app-products-value-summary>
<!--            </div>-->
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})

export class IndexPage extends DeviceInfoUtil implements OnInit {
  pages = [
    {
      name: 'store',
      link: '/store',
      icon: 'list'
    },
    {
      name: 'store in',
      link: '/store/in',
      icon: 'list'
    },
    {
      name: 'store out',
      link: '/store/out',
      icon: 'list'
    },
    {
      name: 'categories',
      link: '/store/categories',
      icon: 'list'
    }
  ];

  constructor(private readonly stockState: StockState) {
    super();
    document.title = 'SmartStock - Store';
  }

  ngOnInit(): void {
    this.stockState.getStocksSummary();
  }

}

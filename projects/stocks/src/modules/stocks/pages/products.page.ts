import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StockState} from '../states/stock.state';


@Component({
  selector: 'app-stock-products',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <app-toolbar [heading]="'Products'" [searchPlaceholder]="'Type to search'"
                            showSearch="true"
                            (searchCallback)="handleSearch($event)" [sidenav]="sidenav">
        </app-toolbar>

        <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
          <!--          <div class="row" style="margin: 40px 0">-->
          <!--            <div class="full-width col-12">-->
          <div style="margin: 40px 0">
            <app-stock-products-table-actions></app-stock-products-table-actions>
            <mat-card class="mat-elevation-z3">
              <app-stock-products-table-sub-actions></app-stock-products-table-sub-actions>
              <app-stock-products-table></app-stock-products-table>
            </mat-card>
          </div>
          <!--            </div>-->
          <!--          </div>-->
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/stock.style.scss']
})
export class ProductsPage extends DeviceInfoUtil implements OnInit {

  constructor(public readonly stockState: StockState) {
    super();
    document.title = 'SmartStock - Products';
  }

  ngOnInit(): void {
  }


  handleSearch(query: string): void {
    this.stockState.filter(query);
  }

}





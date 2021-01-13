import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StockState} from '../states/stock.state';


@Component({
  selector: 'smartstock-stock-products',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <smartstock-toolbar [heading]="'Products'" [searchPlaceholder]="'Type to search'"
                            showSearch="true"
                            (searchCallback)="handleSearch($event)" [sidenav]="sidenav">
        </smartstock-toolbar>

        <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
          <!--          <div class="row" style="margin: 40px 0">-->
          <!--            <div class="full-width col-12">-->
          <div style="margin: 40px 0">
            <smartstock-stock-products-table-actions></smartstock-stock-products-table-actions>
            <mat-card class="mat-elevation-z3">
              <smartstock-stock-products-table-sub-actions></smartstock-stock-products-table-sub-actions>
              <smartstock-stock-products-table></smartstock-stock-products-table>
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
  }

  ngOnInit(): void {
  }


  handleSearch(query: string): void {
    this.stockState.filter(query);
  }

}





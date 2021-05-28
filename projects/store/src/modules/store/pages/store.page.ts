import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StoreState} from '../states/store.state';


@Component({
  selector: 'app-store',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <app-toolbar [heading]="'Store'" [searchPlaceholder]="'Type to search'"
                            showSearch="true"
                            (searchCallback)="handleSearch($event)" [sidenav]="sidenav">
        </app-toolbar>

        <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
          <!--          <div class="row" style="margin: 40px 0">-->
          <!--            <div class="full-width col-12">-->
          <div style="margin: 40px 0">
            <app-store-products-table-actions></app-store-products-table-actions>
            <mat-card class="mat-elevation-z3">
<!--              <app-store-products-table-sub-actions></app-store-products-table-sub-actions>-->
              <app-store-products-table></app-store-products-table>
            </mat-card>
          </div>
          <!--            </div>-->
          <!--          </div>-->
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/store.style.scss']
})
export class StorePage extends DeviceInfoUtil implements OnInit {

  constructor(public readonly stockState: StoreState) {
    super();
    document.title = 'SmartStore - Store';
  }

  ngOnInit(): void {
  }


  handleSearch(query: string): void {
    this.stockState.filter(query);
  }

}





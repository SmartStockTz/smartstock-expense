import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil, DeviceState} from '@smartstocktz/core-libs';
import {StoreState} from '../states/store.state';


@Component({
  selector: 'app-store',
  template: `
    <app-layout-sidenav
      [leftDrawer]="side"
      [showSearch]="false"
      [leftDrawerMode]="enoughWidth()?'side':'over'"
      [leftDrawerOpened]="enoughWidth()"
      [hasBackRoute]="true"
      backLink="/store"
      [heading]="'Store Items'"
      [searchPlaceholder]="'Search..'"
      showSearch="true"
      (searchCallback)="handleSearch($event)"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="min-height: 100vh">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-12">
            <div style="margin: 40px 0">
              <app-store-products-table-actions></app-store-products-table-actions>
              <mat-card class="mat-elevation-z3">
                <app-store-products-table></app-store-products-table>
              </mat-card>
            </div>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/store.style.scss']
})
export class StorePage extends DeviceInfoUtil implements OnInit {

  constructor(public readonly stockState: StoreState,
              public readonly deviceState: DeviceState) {
    super();
    document.title = 'SmartStore - Store';
  }

  ngOnInit(): void {
  }


  handleSearch(query: string): void {
    this.stockState.filter(query);
  }

}





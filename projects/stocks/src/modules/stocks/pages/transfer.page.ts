import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stocks-index',
  template: `
    <app-layout-sidenav [body]="body"
                               [leftDrawer]="leftDrawer"
                               [leftDrawerMode]="enoughWidth()?'side': 'over'"
                               [leftDrawerOpened]="enoughWidth()"
                               [heading]="'Transfer'">
      <ng-template #leftDrawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11"
             style="padding: 16px 0; z-index: -1">
          <div style="margin-top: 24px">
            <app-stock-transfers-table-actions></app-stock-transfers-table-actions>
            <mat-card class="mat-elevation-z2">
              <app-stock-transfers-table></app-stock-transfers-table>
            </mat-card>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})

export class TransferPage extends DeviceInfoUtil implements OnInit {

  constructor() {
    super();
    document.title = 'SmartStock - Stock Transfers';
  }

  ngOnInit(): void {
  }

}

import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stock-transfer-create',
  template: `
    <app-layout-sidenav [body]="body"
                               [leftDrawer]="leftDrawer"
                               [leftDrawerMode]="enoughWidth()?'side': 'over'"
                               [leftDrawerOpened]="enoughWidth()"
                               [heading]="'Create Transfer'">
      <ng-template #leftDrawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <!--        <div class="">-->
        <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11"
             style="padding: 16px 0; z-index: -1">
          <div style="margin-top: 24px">
            <app-stock-transfer-create-form></app-stock-transfer-create-form>
          </div>
        </div>
        <!--        </div>-->
      </ng-template>
    </app-layout-sidenav>
  `
})

export class TransferCreateComponent extends DeviceInfoUtil implements OnInit {
  constructor() {
    super();
    document.title = 'SmartStock - Stock Transfers Create';
  }

  ngOnInit(): void {
  }
}

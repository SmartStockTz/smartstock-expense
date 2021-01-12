import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stock-transfer-create',
  template: `
    <smartstock-layout-sidenav [body]="body"
                               [leftDrawer]="leftDrawer"
                               [leftDrawerMode]="enoughWidth()?'side': 'over'"
                               [leftDrawerOpened]="enoughWidth()"
                               [heading]="'Create Transfer'">
      <ng-template #leftDrawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10"
             style="padding: 16px 0; z-index: -1">
          <div style="margin-top: 24px">
            <smartstock-stock-transfer-create-form></smartstock-stock-transfer-create-form>
          </div>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})

export class TransferCreateComponent extends DeviceInfoUtil implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}

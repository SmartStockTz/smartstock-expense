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
        <!--        <div class="">-->
        <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11"
             style="padding: 16px 0; z-index: -1">
          <div style="margin-top: 24px">
            <smartstock-stock-transfer-create-form></smartstock-stock-transfer-create-form>
          </div>
        </div>
        <!--        </div>-->
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

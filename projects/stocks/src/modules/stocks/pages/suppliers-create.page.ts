import {Component} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-stock-supplier-create',
  template: `
    <app-layout-sidenav [leftDrawer]="drawer" [body]="body" [leftDrawerMode]="enoughWidth()?'side':'over'"
                               heading="Create Supplier"
                               [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <app-drawer></app-drawer>
      </ng-template>

      <ng-template #body>
        <div class="container">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
            <app-stock-supplier-create-form></app-stock-supplier-create-form>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})
export class SuppliersCreatePage extends DeviceInfoUtil {
  constructor() {
    super();
    document.title = 'SmartStock - Supplier Create';
  }
}

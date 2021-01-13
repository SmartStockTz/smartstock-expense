import {Component} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stock-supplier-create',
  template: `
    <smartstock-layout-sidenav [leftDrawer]="drawer" [body]="body" [leftDrawerMode]="enoughWidth()?'side':'over'"
                               heading="Create Supplier"
                               [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>

      <ng-template #body>
        <div class="container">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
            <smartstock-stock-supplier-create-form></smartstock-stock-supplier-create-form>
          </div>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})
export class SuppliersCreatePage extends DeviceInfoUtil {

}

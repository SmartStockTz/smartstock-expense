import {Component} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stock-category-create',
  template: `
    <smartstock-layout-sidenav [leftDrawer]="drawer" [body]="body" [leftDrawerMode]="enoughWidth()?'side':'over'"
                               heading="Create Category"
                               [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container">
          <div class="container-fluid col-xl-9 col-lg-9 col-md-10 col-sm-11">
            <smartstock-stock-category-create-form></smartstock-stock-category-create-form>
          </div>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})
export class CategoryCreatePage extends DeviceInfoUtil {

}

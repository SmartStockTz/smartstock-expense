import {Component} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-store-category-create',
  template: `
    <app-layout-sidenav [leftDrawer]="drawer"
                        [body]="body"
                        [leftDrawerMode]="enoughWidth()?'side':'over'"
                        heading="Create Category"
                        [hasBackRoute]="true"
                        backLink="/store/categories"
                        [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-12">
            <app-store-category-create-form></app-store-category-create-form>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})
export class CategoryCreatePage extends DeviceInfoUtil {
  constructor() {
    super();
    document.title = 'SmartStore - Category Create';
  }
}

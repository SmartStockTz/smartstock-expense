import {Component} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-store-category-create',
  template: `
    <app-layout-sidenav [leftDrawer]="drawer"
                        [body]="body"
                        [leftDrawerMode]="(deviceState.enoughWidth | async) === true?'side':'over'"
                        heading="Create Category"
                        [hasBackRoute]="true"
                        backLink="/expense/categories"
                        [leftDrawerOpened]="(deviceState.enoughWidth | async) === true">
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
export class CategoryCreatePage {
  constructor(public readonly deviceState: DeviceState) {
    document.title = 'SmartStore - Category Create';
  }
}

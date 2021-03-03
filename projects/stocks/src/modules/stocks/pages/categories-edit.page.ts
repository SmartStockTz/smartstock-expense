import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {CategoryState} from '../states/category.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stock-category-edit',
  template: `
    <app-layout-sidenav [leftDrawer]="drawer" [body]="body" [leftDrawerMode]="enoughWidth()?'side':'over'"
                               heading="Edit Category"
                               [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
            <app-stock-category-create-form
              [category]="categoryState.selectedForEdit | async"></app-stock-category-create-form>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})
export class CategoriesEditPage extends DeviceInfoUtil implements OnDestroy, OnInit {
  constructor(public readonly categoryState: CategoryState,
              private readonly router: Router) {
    super();
  }

  ngOnDestroy(): void {
    this.categoryState.selectedForEdit.next(null);
  }

  ngOnInit(): void {
    if (this.categoryState.selectedForEdit.value === null) {
      this.router.navigateByUrl('/stock/categories').catch(_ => {
      });
    }
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {CatalogState} from '../states/catalog.state';
import {Router} from '@angular/router';

@Component({
  selector: 'smartstock-stock-catalog-edit',
  template: `
    <smartstock-layout-sidenav [leftDrawer]="drawer" [body]="body" [leftDrawerMode]="enoughWidth()?'side':'over'"
                               heading="Edit Catalog"
                               [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <smartstock-drawer></smartstock-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
            <smartstock-stock-catalog-create-form
              [catalog]="catalogState.selectedForEdit | async"></smartstock-stock-catalog-create-form>
          </div>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})
export class CatalogEditPage extends DeviceInfoUtil implements OnDestroy, OnInit {
  constructor(public readonly catalogState: CatalogState,
              private readonly router: Router) {
    super();
  }

  ngOnDestroy(): void {
    this.catalogState.selectedForEdit.next(null);
  }

  ngOnInit(): void {
    if (this.catalogState.selectedForEdit.value === null) {
      this.router.navigateByUrl('/stock/catalogs').catch(_ => {
      });
    }
  }
}

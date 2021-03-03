import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {SupplierState} from '../states/supplier.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stock-supplier-edit',
  template: `
    <app-layout-sidenav [leftDrawer]="drawer" [body]="body" [leftDrawerMode]="enoughWidth()?'side':'over'"
                               heading="Edit Supplier"
                               [leftDrawerOpened]="enoughWidth()">
      <ng-template #drawer>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="container">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
            <app-stock-supplier-create-form
              [supplier]="supplierState.selectedForEdit | async"></app-stock-supplier-create-form>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `
})
export class SuppliersEditPage extends DeviceInfoUtil implements OnDestroy, OnInit {
  constructor(public readonly supplierState: SupplierState,
              private readonly router: Router) {
    super();
  }

  ngOnDestroy(): void {
    this.supplierState.selectedForEdit.next(null);
  }

  ngOnInit(): void {
    if (this.supplierState.selectedForEdit.value === null) {
      this.router.navigateByUrl('/stock/suppliers').catch(_ => {
      });
    }
  }
}

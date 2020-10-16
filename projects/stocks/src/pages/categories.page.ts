import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';


@Component({
  selector: 'smartstock-stock-categories',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <smartstock-toolbar [heading]="'Categories'" [showSearch]="false"
                            [searchPlaceholder]="'Type to search'"
                            [sidenav]="sidenav" [showProgress]="false">
        </smartstock-toolbar>

        <div>

          <div class="container">
            <div class="row" style="margin: 40px 0">
              <div class="full-width col-12">
                <smartstock-categories></smartstock-categories>
              </div>
            </div>
          </div>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/stock.style.scss']
})
export class CategoriesPage extends DeviceInfoUtil implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}




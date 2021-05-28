import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';


@Component({
  selector: 'app-store-categories',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <app-toolbar [heading]="'Categories'" [showSearch]="false"
                            [searchPlaceholder]="'Type to search'"
                            [sidenav]="sidenav" [showProgress]="false">
        </app-toolbar>

        <div>

          <div class="container">
            <div class="row" style="margin: 40px 0">
              <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
                <app-categories></app-categories>
              </div>
            </div>
          </div>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/store.style.scss']
})
export class CategoriesPage extends DeviceInfoUtil implements OnInit, OnDestroy {

  constructor() {
    super();
    document.title = 'SmartStock - Store Category';
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}





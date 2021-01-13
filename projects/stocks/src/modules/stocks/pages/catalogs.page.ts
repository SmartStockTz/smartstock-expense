import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';


@Component({
  selector: 'smartstock-stock-catalogs',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <smartstock-toolbar [heading]="'Catalogs'" [showSearch]="false"
                            [searchPlaceholder]="'Type to search'"
                            [sidenav]="sidenav" [showProgress]="false">
        </smartstock-toolbar>

        <div>

          <div class="container">
            <div class="" style="margin: 40px 0">
              <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
                <smartstock-catalogs></smartstock-catalogs>
              </div>
            </div>
          </div>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/stock.style.scss']
})
export class CatalogsPage extends DeviceInfoUtil implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}





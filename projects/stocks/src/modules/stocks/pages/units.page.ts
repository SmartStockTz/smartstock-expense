import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';


@Component({
  selector: 'smartstock-stock-units',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <smartstock-toolbar [heading]="'Units'" [showSearch]="false"
                            [searchPlaceholder]="'Type to search'"
                            [sidenav]="sidenav" [showProgress]="false">
        </smartstock-toolbar>

        <div class="container">

          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-11">
            <div style="margin: 40px 0">
              <!--              <div class="full-width col-12">-->
              <smartstock-units></smartstock-units>
              <!--              </div>-->
            </div>
          </div>

        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/stock.style.scss']
})
export class UnitsPage extends DeviceInfoUtil implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}




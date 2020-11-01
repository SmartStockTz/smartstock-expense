import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stocks-index',
  template: `
    <mat-sidenav-container>
      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side': 'over'" [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="height: 100vh">
        <smartstock-toolbar [heading]="'Transfer'" [sidenav]="sidenav"></smartstock-toolbar>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10" style="padding: 16px 0">

        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})

export class TransferPage extends DeviceInfoUtil implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'smartstock-stocks-index',
  template: `
    <!--    <mat-sidenav-container>-->
    <!--      <mat-sidenav class="match-parent-side" #sidenav [mode]="" [opened]="enoughWidth()">-->
    <!--        -->
    <!--      </mat-sidenav>-->
    <!--      <mat-sidenav-content style="height: 100vh">-->
    <!--        <smartstock-toolbar [heading]="'Transfer'" [sidenav]="sidenav"></smartstock-toolbar>-->

    <!--      </mat-sidenav-content>-->
    <!--    </mat-sidenav-container>-->

    <smartstock-layout-sidenav [body]="body"
                               [leftDrawer]="leftDrawer"
                               [leftDrawerMode]="enoughWidth()?'side': 'over'"
                               [leftDrawerOpened]="enoughWidth()"
                               [heading]="'Transfer'">
      <ng-template #leftDrawer>
        <div class="match-parent">
          <smartstock-drawer></smartstock-drawer>
        </div>
      </ng-template>
      <ng-template #body>
        <div style="height: 100vh">
          <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10" style="padding: 16px 0">
            <div style="margin-top: 24px">
              <smartstock-stock-transfers-table-actions></smartstock-stock-transfers-table-actions>
              <mat-card class="mat-elevation-z2">
                <smartstock-stock-transfers-table></smartstock-stock-transfers-table>
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
                <!--              <smartstock-stock-transfers-table></smartstock-stock-transfers-table>-->
              </mat-card>
            </div>
          </div>
        </div>
      </ng-template>
    </smartstock-layout-sidenav>
  `
})

export class TransferPage extends DeviceInfoUtil implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}

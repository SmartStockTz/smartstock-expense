import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StoreState} from '../states/store.state';

@Component({
  selector: 'app-store-index',
  template: `
    <mat-sidenav-container>
      <mat-sidenav class="match-parent-side" #sidenav [mode]="enoughWidth()?'side': 'over'" [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>
      <mat-sidenav-content style="height: 100vh">
        <app-toolbar searchPlaceholder="Filter product" [heading]="'Store'"
                            [sidenav]="sidenav"></app-toolbar>
        <div class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10" style="">
          <h1 style="margin-top: 16px">Go To</h1>
          <div class="d-flex flex-row flex-wrap">
            <div *ngFor="let page of pages" routerLink="{{page.link}}" style="margin: 5px; cursor: pointer">
              <mat-card matRipple
                        style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                <mat-icon color="primary" style="font-size: 60px; height: 60px; width: 60px">
                  {{page.icon}}
                </mat-icon>
              </mat-card>
              <p>{{page.name}}</p>
            </div>
          </div>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})

export class IndexPage extends DeviceInfoUtil implements OnInit {
  pages = [
    {
      name: 'Items',
      link: '/store/item',
      icon: 'store'
    },
    {
      name: 'Store In',
      link: '/store/item/in',
      icon: 'add'
    },
    {
      name: 'Store Out',
      link: '/store/item/out',
      icon: 'remove'
    },
    {
      name: 'Categories',
      link: '/store/categories',
      icon: 'list'
    },
    {
      name: 'Reports',
      link: '/store/report',
      icon: 'dashboard'
    }
  ];

  constructor(private readonly stockState: StoreState) {
    super();
    document.title = 'SmartStore - Store';
  }

  ngOnInit(): void {
    this.stockState.getStoresSummary();
  }

}

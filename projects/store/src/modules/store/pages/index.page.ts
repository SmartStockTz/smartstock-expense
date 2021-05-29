import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil, DeviceState} from '@smartstocktz/core-libs';
import {StoreState} from '../states/store.state';

@Component({
  selector: 'app-store-index',
  template: `
    <app-layout-sidenav
      [leftDrawer]="side"
      [showSearch]="false"
      [leftDrawerOpened]="enoughWidth()"
      [leftDrawerMode]="enoughWidth()?'side':'over'"
      [heading]="'Store'"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>

        <div *ngIf="(deviceSatte.isSmallScreen | async)===false"
             class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10">
          <h1 class="d-none d-sm-none d-md-block" style="margin-top: 16px">Go To</h1>
          <div class="d-flex flex-row flex-wrap">
            <div *ngFor="let page of pages"
                 routerLink="{{page.link}}" style="margin: 5px; cursor: pointer">
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

        <mat-nav-list *ngIf="(deviceSatte.isSmallScreen | async)===true" style="min-height: 100vh">
          <div *ngFor="let page of pages" routerLink="{{page.link}}">
            <mat-list-item>
              <mat-icon matListIcon>{{page.icon}}</mat-icon>
              <h1 matLine>{{page.name}}</h1>
            </mat-list-item>
            <mat-divider></mat-divider>
          </div>
        </mat-nav-list>

      </ng-template>
    </app-layout-sidenav>
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

  constructor(private readonly stockState: StoreState,
              public readonly deviceSatte: DeviceState) {
    super();
    document.title = 'SmartStock - Store';
  }

  ngOnInit(): void {
    this.stockState.getStoresSummary();
  }

}

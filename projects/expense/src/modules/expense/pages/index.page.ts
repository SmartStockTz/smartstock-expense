import {Component, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';
import {ExpenseState} from '../states/expense.state';

@Component({
  selector: 'app-store-index',
  template: `
    <app-layout-sidenav
      [leftDrawer]="side"
      [showSearch]="false"
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [leftDrawerMode]="(deviceState.enoughWidth | async) === true?'side':'over'"
      [heading]="'Expenses'"
      [body]="body">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>

        <div *ngIf="(deviceState.isSmallScreen | async)===false"
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

        <mat-nav-list *ngIf="(deviceState.isSmallScreen | async)===true" style="min-height: 100vh">
          <div *ngFor="let page of pages" routerLink="{{page.link}}">
            <mat-list-item>
              <mat-icon matListIcon>{{page.icon}}</mat-icon>
              <h1 matLine>{{page.name}}</h1>
            </mat-list-item>
            <mat-divider></mat-divider>
          </div>
        </mat-nav-list>

        <div *ngIf="(deviceState.isSmallScreen | async)===false"
             class="container col-xl-10 col-lg-10 col-sm-9 col-md-9 col-sm-12 col-10 mt-3">
          <h2>This Month Summary</h2>
          <div class="row">
            <div class="col-xl-6 col-lg-6 col-sm-12 col-md-12 mb-5">
              <app-dash-card [content]="cr" title="Expense by category" [height]="400">
                <ng-template #cr>
                  <app-store-by-category-report></app-store-by-category-report>
                </ng-template>
              </app-dash-card>
            </div>
            <div class="col-xl-6 col-lg-6 col-sm-12 col-md-12">
              <app-dash-card [content]="tr" title="Expense by item" [height]="400">
                <ng-template #tr>
                  <app-store-by-tag-report></app-store-by-tag-report>
                </ng-template>
              </app-dash-card>
            </div>
          </div>
        </div>

      </ng-template>
    </app-layout-sidenav>
  `
})

export class IndexPage implements OnInit {
  pages = [
    {
      name: 'Items',
      link: '/expense/item',
      icon: 'list'
    },
    {
      name: 'Add item',
      link: '/expense/item/in',
      icon: 'add'
    },
    {
      name: 'Add expenses',
      link: '/expense/item/out',
      icon: 'receipt'
    },
    {
      name: 'Categories',
      link: '/expense/categories',
      icon: 'list'
    },
    {
      name: 'Reports',
      link: '/expense/report',
      icon: 'dashboard'
    }
  ];

  constructor(private readonly stockState: ExpenseState,
              public readonly deviceState: DeviceState) {
    document.title = 'SmartStock - Expense';
  }

  ngOnInit(): void {
    this.stockState.getStoresSummary();
  }

}

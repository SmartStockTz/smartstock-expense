import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StoreState} from '../states/store.state';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-store-report',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true" #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <app-toolbar [heading]="'Store Report'"
                     [showSearch]="false"
                     [sidenav]="sidenav">
        </app-toolbar>

        <div class="container col-lg-8 col-xl-8 col-sm-11 col-md-10 col-11">
          <div style="margin: 40px 0 0 0" class="d-flex flex-wrap align-items-center">
            <mat-form-field appearance="fill">
              <mat-label>Enter a date range</mat-label>
              <mat-date-range-input [formGroup]="dateRange" [rangePicker]="picker">
                <input matStartDate formControlName="start" placeholder="Start date">
                <input matEndDate formControlName="end" placeholder="End date">
              </mat-date-range-input>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-date-range-picker #picker></mat-date-range-picker>
            </mat-form-field>
            <span class="flex-grow-1"></span>
            <button (click)="applyDate()" [disabled]="!dateRange.valid" style="height: 38px" color="primary" mat-flat-button>Apply</button>
          </div>
        </div>

        <div class="container col-lg-8 col-xl-8 col-sm-11 col-md-10 col-11">
          <div style="margin: 40px 0">
            <mat-card class="mat-elevation-z3">
              <app-store-report-component></app-store-report-component>
            </mat-card>
          </div>
        </div>

        <div class="container col-lg-8 col-xl-8 col-sm-11 col-md-10 col-11" style="margin-bottom: 100px">
          <div class="row">
            <div class="col-12" style="margin-bottom: 16px">
              <app-dash-card [description]="'Store frequency by category'"
                             [height]="400"
                             [content]="byCategory"
                             [title]="'Performance By Category'">
                <ng-template #byCategory>
                  <app-store-by-category-report></app-store-by-category-report>
                </ng-template>
              </app-dash-card>
            </div>
            <div class="col-12" style="margin-bottom: 16px">
              <app-dash-card [description]="'Store frequency by store tag'"
                             [height]="400"
                             [content]="byTag"
                             [title]="'Performance By Tag'">
                <ng-template #byTag>
                  <app-store-by-tag-report></app-store-by-tag-report>
                </ng-template>
              </app-dash-card>
            </div>
          </div>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/store.style.scss']
})
export class StoreReportPage extends DeviceInfoUtil implements OnInit {

  dateRange: FormGroup;

  constructor(public readonly storeState: StoreState,
              private readonly formBuilder: FormBuilder) {
    super();
    document.title = 'SmartStock - Store Report';
  }

  ngOnInit(): void {
    this.dateRange = this.formBuilder.group({
      start: [this.storeState.reportStartDate.value, [Validators.nullValidator, Validators.required]],
      end: [this.storeState.reportEndDate.value, [Validators.nullValidator, Validators.required]],
    });
  }


  handleSearch(query: string): void {
    this.storeState.filter(query);
  }

  applyDate(): any {
    this.storeState.reloadReport(this.dateRange.value).catch(console.log);
  }
}





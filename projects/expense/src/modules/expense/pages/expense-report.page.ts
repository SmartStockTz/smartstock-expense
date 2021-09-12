import {Component, OnInit} from '@angular/core';
import {DeviceState} from '@smartstocktz/core-libs';
import {ExpenseState} from '../states/expense.state';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-store-report',
  template: `
    <app-layout-sidenav [heading]="'Expense Report'"
                        [leftDrawerMode]="(deviceState.enoughWidth | async) === true?'side':'over'"
                        [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
                        [showSearch]="false"
                        [hasBackRoute]="true"
                        backLink="/expense"
                        [body]="body"
                        [leftDrawer]="side">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="min-height: 100vh">
          <div class="container col-lg-8 col-xl-8 col-sm-11 col-md-10 col-12">
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
              <button (click)="applyDate()" [disabled]="!dateRange.valid"
                      style="height: 38px"
                      color="primary" mat-flat-button>Apply
              </button>
            </div>
          </div>
          <div class="container col-lg-8 col-xl-8 col-sm-11 col-md-10 col-12">
            <div style="margin: 40px 0">
              <mat-card class="mat-elevation-z3">
                <app-store-report-component></app-store-report-component>
              </mat-card>
            </div>
          </div>
          <div class="container col-lg-8 col-xl-8 col-sm-11 col-md-10 col-12" style="margin-bottom: 100px">
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
                <app-dash-card [description]="'Store frequency by item tag'"
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
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/store.style.scss']
})
export class ExpenseReportPage implements OnInit {

  dateRange: FormGroup;

  constructor(public readonly storeState: ExpenseState,
              public readonly deviceState: DeviceState,
              private readonly formBuilder: FormBuilder) {
    document.title = 'SmartStock - Expense Report';
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





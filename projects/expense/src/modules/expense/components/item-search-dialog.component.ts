import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ExpenseState} from '../states/expense.state';
import {FormControl} from '@angular/forms';
import {ExpenseItemModel} from '../models/expense-item.model';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-store-products-search-dialog',
  template: `
    <div>
      <div mat-dialog-title>
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
          <input placeholder="Search product..." [formControl]="searchFormControl" class="search-input"
                 style="flex-grow: 1;">
          <div style="width: 20px; height: auto"></div>
          <button [disabled]="(expenseState.isFetchExpenseItems | async)===true" (click)="getProducts()" mat-flat-button
                  color="primary" style="flex-grow: 0">
            <mat-icon *ngIf="(expenseState.isFetchExpenseItems | async)===false">refresh</mat-icon>
            <mat-progress-spinner *ngIf="(expenseState.isFetchExpenseItems | async)===true" mode="indeterminate"
                                  diameter="20"
                                  color="primary"
                                  style="display: inline-block"></mat-progress-spinner>
          </button>
        </div>
      </div>
      <div mat-dialog-content>
        <cdk-virtual-scroll-viewport [itemSize]="50" style="height: 300px">
          <div *cdkVirtualFor="let product of expenseState.expenseItems.data">
            <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
              <p style="flex-grow: 1; margin: 0; padding: 4px; text-align: start; display: flex; align-items: center">
                {{product.name}}
              </p>
              <div style="width: 20px; height: auto"></div>
              <button (click)="selectProduct(product)" mat-button color="primary" style="flex-grow: 0;margin: 4px">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <mat-divider></mat-divider>
          </div>
        </cdk-virtual-scroll-viewport>
      </div>
      <div mat-dialog-actions>
        <button mat-button color="warn" mat-dialog-close>Close</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/product-search-dialog.style.scss']
})

export class ItemSearchDialogComponent implements OnInit {
  searchFormControl = new FormControl('');

  constructor(public readonly dialogRef: MatDialogRef<ItemSearchDialogComponent>,
              public readonly expenseState: ExpenseState) {
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500)
      ).subscribe(value => {
      this.expenseState.filter(value);
    });
    this.expenseState.getExpenseItems().catch(console.log);
  }

  getProducts(): void {
    this.expenseState.getStoresFromRemote();
  }

  selectProduct(product: ExpenseItemModel): void {
    this.dialogRef.close(product);
  }
}

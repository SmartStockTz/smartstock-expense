import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';
import {MatTableDataSource} from '@angular/material/table';
import {any} from 'codelyzer/util/function';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

// @dynamic
@Component({
  selector: 'app-stock-details',
  template: `
    <div class="bg-success text-white m-0 p-3">
      <h1>Store Out</h1>
      <h2 class="row justify-content-between">
        <span class=" px-2">{{data.tag}}</span>
        <span class=" px-2">{{data.category}}</span>
      </h2>
    </div>
    <mat-card class="mat-elevation-z3 m-3">
      <table mat-table matSort [dataSource]="storeOutDatasource">

        <ng-container matColumnDef="no">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
          <td mat-cell *matCellDef="let i = index">{{i + 1}}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <ng-container matColumnDef="dateOut">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date Out</th>
          <td mat-cell *matCellDef="let element">
            {{element.dateOut ? (element.dateOut | date) : 'N/A'}}
          </td>
          <td mat-footer-cell class="font-weight-bold" *matFooterCellDef> Total</td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Current Quantity</th>
          <td mat-cell *matCellDef="let element">
            {{(element.quantity | number)}}
          </td>
          <td mat-footer-cell class="font-weight-bold" *matFooterCellDef> {{getTotalQuantity() | number}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="storeOutColumns"></tr>
        <tr class="table-data-row" matTooltip="Click for store out details" mat-row
            *matRowDef="let row; columns: storeOutColumns;"></tr>
        <tr mat-footer-row *matFooterRowDef="storeOutColumns"></tr>

      </table>
      <mat-paginator #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                     showFirstLastButtons></mat-paginator>
    </mat-card>
  `
})
export class StoreOutDetailsComponent implements OnInit {
  storeOutDatasource: MatTableDataSource<any>;
  storeOutColumns = ['no', 'dateOut', 'quantity'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private bottomSheetRef: MatBottomSheetRef<StoreOutDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.storeOutDatasource = new MatTableDataSource(this.data.storeOut);
    setTimeout(() => {
      this.storeOutDatasource.paginator = this.paginator;
      this.storeOutDatasource.sort = this.matSort;
    });
  }

  getTotalQuantity(): number {
    return this.data.storeOut.map(x => x.quantity).reduce((acc, value) => acc + value, 0);
  }
}

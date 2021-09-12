import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

// @dynamic
@Component({
  selector: 'app-store-details',
  template: `
    <div class="bg-success text-white m-0 pb-3">
      <h1>Details</h1>
      <h2 class="row justify-content-between">
        <span class="px-2">{{data.id}}</span>
      </h2>
    </div>
    <mat-card class="mat-elevation-z0">
      <table mat-table matSort [dataSource]="storeOutDatasource">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let element">
            {{element.date ? (element.date | date) : 'N/A'}} {{element.time ? (element.time) : ''}}
          </td>
          <td mat-footer-cell class="font-weight-bold" *matFooterCellDef>Total</td>
        </ng-container>
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
          <td mat-cell *matCellDef="let element">
            {{(element.amount | number)}}
          </td>
          <td mat-footer-cell class="font-weight-bold" *matFooterCellDef>{{getTotalAmount() | number}}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="storeOutColumns"></tr>
        <tr class="table-data-row" matTooltip="Click for store out details" mat-row *matRowDef="let row; columns: storeOutColumns;"></tr>
        <tr mat-footer-row *matFooterRowDef="storeOutColumns"></tr>

      </table>
      <mat-paginator #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                     showFirstLastButtons></mat-paginator>
    </mat-card>
  `
})
export class ExpenseReportDetailsComponent implements OnInit {
  storeOutDatasource: MatTableDataSource<{ date: string, quantity: number }>;
  storeOutColumns = ['date', 'amount'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(private bottomSheetRef: MatBottomSheetRef<ExpenseReportDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.storeOutDatasource = new MatTableDataSource(this.data.track);
  }

  getTotalAmount(): number {
    return this.data.track.map(x => x.amount).reduce((a, b) => a + b, 0);
  }
}

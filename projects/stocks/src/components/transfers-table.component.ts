import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {TransactionModel} from 'bfastjs/dist/models/TransactionModel';
import {TransferState} from '../states/transfer.state';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'smartstock-stock-transfers-table',
  template: `
    <table mat-table [dataSource]="transfersDatasource">
      <ng-container cdkColumnDef="date">
        <th mat-header-cell *cdkHeaderCellDef></th>
        <td mat-cell *cdkCellDef="let element"></td>
      </ng-container>
      <ng-container cdkColumnDef="to">
        <th mat-header-cell *cdkHeaderCellDef></th>
        <td mat-cell *cdkCellDef="let element"></td>
      </ng-container>
      <ng-container cdkColumnDef="user">
        <th mat-header-cell *cdkHeaderCellDef></th>
        <td mat-cell *cdkCellDef="let element"></td>
      </ng-container>
      <ng-container cdkColumnDef="amount">
        <th mat-header-cell *cdkHeaderCellDef></th>
        <td mat-cell *cdkCellDef="let element"></td>
      </ng-container>
      <ng-container cdkColumnDef="note">
        <th mat-header-cell *cdkHeaderCellDef></th>
        <td mat-cell *cdkCellDef="let element"></td>
      </ng-container>
      <tr mat-header-row *cdkHeaderRowDef="transfersTableColumn"></tr>
      <tr mat-row *matRowDef="let row; columns transfersTableColumn"></tr>
    </table>
    <mat-paginator #paginator [pageSizeOptions]="[5,10,25,50]"></mat-paginator>
  `
})

export class TransfersTableComponent implements OnInit, OnDestroy {
  onDestroy: Subject<any> = new Subject<any>();
  transfersTableColumn = ['date', 'to', 'user', 'amount', 'note'];
  transfersDatasource: MatTableDataSource<TransactionModel> = new MatTableDataSource<TransactionModel>([]);

  constructor(public readonly transferState: TransferState) {
    transferState.transfers.pipe(
      takeUntil(this.onDestroy)
    ).subscribe(value => {
      this.transfersDatasource.data = value;
    });
  }

  ngOnInit(): void {
    this.transferState.fetch();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

}

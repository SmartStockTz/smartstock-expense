import {Component, OnInit} from '@angular/core';
import {TransferState} from "../states/transfer.state";

@Component({
  selector: 'smartstock-stock-transfers-table-actions',
  template: `
    <mat-card-title class="d-flex flex-row">
      <button routerLink="/stock/transfers/create" color="primary" class="ft-button" mat-flat-button>
        Add Transfer
      </button>
      <span class="toolbar-spacer"></span>
      <span style="width: 8px; height: 8px"></span>
      <button (click)="transferState.fetch()"
              [disabled]="(transferState.isFetchTransfers | async) === true"
              matTooltip="Reload from server"
              color="primary"
              class="ft-button" mat-flat-button>
        <mat-icon *ngIf="(transferState.isFetchTransfers | async) === false">
          refresh
        </mat-icon>
        <mat-progress-spinner *ngIf="(transferState.isFetchTransfers | async)===true" [diameter]="20"
                              matTooltip="Fetch products from server"
                              mode="indeterminate"
                              color="primary">
        </mat-progress-spinner>
      </button>
      <!--      <span style="width: 8px; height: 8px"></span>-->
      <!--      <button (click)="exportStock()" [disabled]="(stockState.isExportToExcel | async)===true"-->
      <!--              matTooltip="Export Products To Csv"-->
      <!--              color="primary"-->
      <!--              class="ft-button" mat-flat-button>-->
      <!--        <mat-icon *ngIf="(stockState.isExportToExcel | async) === false">-->
      <!--          cloud_download-->
      <!--        </mat-icon>-->
      <!--        <mat-progress-spinner *ngIf="(stockState.isExportToExcel | async)===true" [diameter]="20"-->
      <!--                              matTooltip="Export Products InProgress.."-->
      <!--                              mode="indeterminate"-->
      <!--                              color="primary">-->
      <!--        </mat-progress-spinner>-->
      <!--      </button>-->
      <!--      <span style="width: 8px; height: 8px"></span>-->
      <!--      <button (click)="importStocks()" matTooltip="Import Products" color="primary" class="ft-button"-->
      <!--              mat-flat-button>-->
      <!--        <mat-icon>cloud_upload</mat-icon>-->
      <!--      </button>-->
    </mat-card-title>
  `
})

export class TransfersTableActionsComponent implements OnInit {

  constructor(public readonly transferState: TransferState) {
  }

  ngOnInit(): void {

  }

  hotReloadStocks(): void {
    this.transferState.fetch();
  }

  exportStock(): void {
    // this.transferState.exportToExcel();
  }

  importStocks(): void {
    // this.dialog.open(ImportsDialogComponent, {
    //   closeOnNavigation: true,
    // });
  }

}

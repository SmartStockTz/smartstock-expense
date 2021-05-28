import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MessageService, PrintService} from '@smartstocktz/core-libs';
import {TransferModel} from '../models/transfer.model';
// @dynamic
@Component({
  selector: 'app-store-transfers-export-options',
  template: `
    <div style="display: flex; flex-direction: row">
      <div style="flex-grow: 1"></div>
      <button (click)="bottomSheetRef.dismiss()" mat-button color="warn">Close</button>
    </div>
    <div style="margin-bottom: 50px">
      <mat-nav-list>
        <!--        <mat-list-item>-->
        <!--          <h1 matLine>CSV</h1>-->
        <!--          <p matLine>Comma separated text file</p>-->
        <!--          <mat-icon matListIcon>description</mat-icon>-->
        <!--        </mat-list-item>-->
        <!--        <mat-divider></mat-divider>-->
        <!--        <mat-list-item>-->
        <!--          <h1 matLine>PDF</h1>-->
        <!--          <p matLine>Portable document format</p>-->
        <!--          <mat-icon matListIcon>description</mat-icon>-->
        <!--        </mat-list-item>-->
        <!--        <mat-divider></mat-divider>-->
        <mat-list-item (click)="printTransfer()" [disabled]="isPrinting">
          <h1 matLine>
            Thermal Printer
          </h1>
          <p matLine>Print as a receipt</p>
          <div matListIcon>
            <mat-icon *ngIf="!isPrinting">
              receipt
            </mat-icon>
            <mat-progress-spinner *ngIf="isPrinting" mode="indeterminate" color="primary" diameter="20"
                                  style="display: inline-block"></mat-progress-spinner>
          </div>
        </mat-list-item>
        <mat-divider></mat-divider>
      </mat-nav-list>
    </div>
  `
})
export class TransfersExportOptionsComponent {
  isPrinting = false;

  constructor(public readonly bottomSheetRef: MatBottomSheetRef<TransfersExportOptionsComponent>,
              private readonly printService: PrintService,
              private readonly message: MessageService,
              private readonly changeDet: ChangeDetectorRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) private readonly data: { transfer: TransferModel }) {
  }

  async printTransfer(): Promise<void> {
  }
}

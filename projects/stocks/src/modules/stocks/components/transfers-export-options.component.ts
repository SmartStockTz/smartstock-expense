import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MessageService, PrintService} from '@smartstocktz/core-libs';
import {TransferModel} from '../models/transfer.model';
// @dynamic
@Component({
  selector: 'smartstock-stock-transfers-export-options',
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
    let items = '';
    for (let i = 0; i < this.data.transfer.items.length; i++) {
      items += `
      ${i + 1}. ${this.data.transfer.items[i].product.product} --> Quantity : ${this.data.transfer.items[i].quantity}\n
      `;
    }
    this.isPrinting = true;
    this.printService.print({
      printer: 'tm20',
      data: [
        'Date : ' + this.data.transfer.date + '\n',
        'From : ' + this.data.transfer.from_shop + '\n',
        'To : ' + this.data.transfer.to_shop + '\n',
        '-----------------------------------------\n',
        'Items\n',
        '-----------------------------------------\n',
        items
      ].join(''),
      id: '',
      qr: ''
    }).then(value => {
      this.message.showMobileInfoMessage('Printed', 1000, 'bottom');
      this.bottomSheetRef.dismiss();
    }).catch(reason => {
      this.isPrinting = false;
      this.message.showMobileInfoMessage(reason && reason.message ? reason.message : reason.toString(),
        1000, 'bottom');
    }).finally(() => {
      this.isPrinting = false;
      this.changeDet.detectChanges();
    });
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {TransferModel} from '../models/transfer.model';
// @dynamic
@Component({
  selector: 'smartstock-stock-transfer-views',
  template: `
    <div style="display: flex; flex-direction: row;">
      <div style="flex-grow: 1"></div>
      <button mat-button color="warn" (click)="bottomSheetRef.dismiss()">
        Close
      </button>
    </div>
    <div style="margin-bottom: 50px">
      <h1 style="margin: 0">Products</h1>
      <mat-divider></mat-divider>
      <mat-list>
        <div *ngFor="let item of data.transfer.items">
          <mat-list-item>
            <h1 matLine>{{item.product.product}}</h1>
            <span matLine>Quantity : {{item.quantity}}</span>
          </mat-list-item>
          <mat-divider></mat-divider>
        </div>
      </mat-list>
    </div>
  `
})

export class TransfersItemsViewComponent {
  constructor(public readonly bottomSheetRef: MatBottomSheetRef<TransfersItemsViewComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: {
                transfer: TransferModel
              }) {
  }
}

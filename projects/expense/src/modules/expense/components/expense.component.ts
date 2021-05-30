import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ExpenseItemModel} from '../models/expense-item.model';

// @dynamic
@Component({
  selector: 'app-store-details',
  template: `
    <div *ngFor="let stockKey of getStores()">
      <h5
        *ngIf="stockKey!=='image' && stockKey !=='id' && stockKey!=='createdAt' && stockKey!=='updatedAt' && stockKey!=='idOld' ">
        {{stockKey}}
      </h5>
      <span
        *ngIf="stockKey!=='image' && stockKey !=='id' && stockKey!=='createdAt' && stockKey!=='updatedAt' && stockKey!=='idOld'">
    {{data[stockKey]}}
  </span>
      <mat-divider
        *ngIf="stockKey!=='image' && stockKey !=='id' && stockKey!=='createdAt' && stockKey!=='updatedAt' && stockKey!=='idOld'"
        style="margin-bottom: 8px">
      </mat-divider>
    </div>
  `
})
export class StoreDetailsComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<StoreDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: ExpenseItemModel) {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getStores(): string[] {
    return Object.keys(this.data);
  }
}

// @dynamic
@Component({
  selector: 'app-dialog-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete : <b>{{' ' + data.title}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button color="primary" mat-button (click)="delete()">Delete</button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button color="primary" mat-button (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class DialogDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }) {
  }

  delete(): void {
    this.dialogRef.close('yes');
  }

  cancel(): void {
    this.dialogRef.close('no');
  }
}

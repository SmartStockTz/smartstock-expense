import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-stock-supplier-create-form-bottom-sheer',
  template: `
    <app-stock-supplier-create-form [bottomRef]="bottomRef" [supplier]="null"></app-stock-supplier-create-form>
  `
})

export class SupplierCreateFormBottomSheetComponent {

  constructor(public readonly bottomRef: MatBottomSheetRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: any) {
  }
}

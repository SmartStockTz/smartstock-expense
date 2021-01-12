import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'smartstock-stock-supplier-create-form-bottom-sheer',
  template: `
    <smartstock-stock-category-create-form [bottomRef]="bottomRef" [category]="null"></smartstock-stock-category-create-form>
  `
})

export class CategoryCreateFormBottomSheetComponent {

  constructor(public readonly bottomRef: MatBottomSheetRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) public readonly data: any) {
  }
}

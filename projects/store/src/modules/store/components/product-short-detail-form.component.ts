import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {StoreModel} from '../models/store.model';

@Component({
  selector: 'app-product-short-detail-form',
  template: `
    <form [formGroup]="parentForm">
      <h2>
        Product
      </h2>
      <mat-card class="card-wrapper">
        <mat-card-content class="card-content">
          <mat-form-field appearance="fill" class="my-input">
            <mat-label>Name</mat-label>
            <input matInput type="text" required formControlName="product">
            <mat-error>Product name required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="fill" class="my-input">
            <mat-label>Barcode</mat-label>
            <input matInput type="text" formControlName="barcode">
            <!--            <mat-error>barcode required</mat-error>-->
          </mat-form-field>
<!--          <mat-form-field *ngIf="saleable === true" appearance="fill" class="my-input">-->
<!--            <mat-label>Sale Price</mat-label>-->
<!--            <span matSuffix>TZS</span>-->
<!--            <input min="0" matInput type="number" required formControlName="retailPrice">-->
<!--            <mat-error>Sale price required</mat-error>-->
<!--          </mat-form-field>-->
          <app-category-form-field [formGroup]="parentForm"></app-category-form-field>
<!--          <app-catalog-form-field [formGroup]="parentForm"></app-catalog-form-field>-->
<!--          <div class="d-flex align-items-center">-->
<!--            <mat-checkbox style="margin-right: 5px" formControlName="downloadable"></mat-checkbox>-->
<!--            <p style="margin: 0">Can be downloaded</p>-->
<!--          </div>-->
<!--          <div *ngIf="downloadAble" class="card-wrapper">-->
<!--            <app-store-downloadable [files]="isUpdateMode?initialStore.downloads:[]">-->
<!--            </app-store-downloadable>-->
<!--          </div>-->
        </mat-card-content>
      </mat-card>
    </form>
  `
})
export class ProductShortDetailFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() saleable = true;
  @Input() downloadAble = false;
  @Input() isUpdateMode = false;
  @Input() initialStore: StoreModel;

  constructor() {
  }

  ngOnInit(): void {
  }

  downloadsFormControl(): FormControl {
    return this.parentForm.get('downloads') as FormControl;
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MessageService} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {StoreOutSearchComponent} from './store-out-search.component';

// @dynamic
@Component({
  selector: 'app-store-out-component',
  template: `
    <div class="">
      <form *ngIf="storeOutFormGroup" [formGroup]="storeOutFormGroup">
        <h1 style="margin-top: 16px">Products</h1>
        <div style="margin-bottom: 16px; display: flex; flex-direction: row; flex-wrap: wrap">
          <button (click)="addProductToTable($event)"
                  mat-button color="primary">
            <mat-icon matSuffix>add</mat-icon>
            Add Product
          </button>
          <div style="width: 16px; height: 16px"></div>
          <button (click)="saveStoreOut()" [disabled]="showProgress" mat-flat-button color="primary">
            <mat-icon matSuffix>done_all</mat-icon>
            Submit
            <mat-progress-spinner mode="indeterminate" diameter="20" style="display: inline-block"
                                  *ngIf="showProgress"
                                  color="primary"></mat-progress-spinner>
          </button>
        </div>
        <mat-card>
          <table mat-table [dataSource]="storeOutDataSource">
            <ng-container cdkColumnDef="tag">
              <th mat-header-cell *cdkHeaderCellDef>Product</th>
              <td mat-cell *cdkCellDef="let element">{{element.stock.tag}}</td>
              <td mat-footer-cell *cdkFooterCellDef>
                <h2 style="margin: 0; padding: 5px">TOTAL</h2>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="quantity-in-store">
              <th mat-header-cell *cdkHeaderCellDef>Quantity in Store</th>
              <td mat-cell *cdkCellDef="let element">{{element.stock.quantity}}</td>
              <td mat-footer-cell *cdkFooterCellDef>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="quantity">
              <th mat-header-cell *cdkHeaderCellDef>Quantity</th>
              <td mat-cell *cdkCellDef="let element">
                <input class="quantity-input" (change)="updateQuantity(element, $event)" type="number" min="1"
                        [value]="element.quantity">
              </td>
              <td mat-footer-cell *cdkFooterCellDef>
                <h1 style="margin: 0; padding: 5px">{{totalQuantity | number}}</h1>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="action">
              <th mat-header-cell *cdkHeaderCellDef>Action</th>
              <td mat-cell *cdkCellDef="let element">
                <button (click)="removeItem($event, element)" mat-icon-button color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
              <td mat-footer-cell *cdkFooterCellDef>
              </td>
            </ng-container>
            <tr mat-header-row *cdkHeaderRowDef="storeOutTableColumn"></tr>
            <tr mat-row *matRowDef="let row; columns storeOutTableColumn"></tr>
            <tr mat-footer-row *matFooterRowDef="storeOutTableColumn"></tr>
          </table>
        </mat-card>
      </form>
    </div>
  `,
  styleUrls: ['../styles/store-out-component.style.scss']
})
export class StoreOutComponent implements OnInit {
  showProgress = false;
  private currentUser: any;
  creditors: Observable<any[]>;
  customers: Observable<any[]>;
  storeOutFormGroup: FormGroup;
  storeOutDataSource: MatTableDataSource<{ quantity: number, stock: any }> = new MatTableDataSource([]);
  storeOutTableColumn = ['tag', 'quantity-in-store', 'quantity', 'action'];
  selectedProducts: { quantity: number, stock: any }[] = [];
  totalQuantity = 0;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly message: MessageService,
              private readonly dialog: MatDialog,
              private router: Router,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.storeOutFormGroup = this.formBuilder.group({
      tag: [null, [Validators.required, Validators.nullValidator]],
      quantity: [0, [Validators.required, Validators.nullValidator]],
      dateOut: [new Date(), [Validators.required, Validators.nullValidator]]
    });
  }


  addProductToTable($event: MouseEvent): void {
    $event.preventDefault();
    this.dialog.open(StoreOutSearchComponent).afterClosed().subscribe(value => {
      if (value && value.tag) {
        this.selectedProducts.unshift({
          quantity: 1,
          stock: value
        });
        this.storeOutDataSource = new MatTableDataSource<any>(this.selectedProducts);
        this.updatetotalQuantity();
      }
    });
  }

  updateQuantity(element: { quantity: number, stock: any }, $event: Event): void {
    // @ts-ignore
    const newQuantity = Number($event.target.value);
    if (newQuantity >= 1 && newQuantity <= element.stock.quantity) {
      this.selectedProducts.map(x => {
        if (x.stock.id === element.stock.id) {
          x.quantity = newQuantity;
        }
        return x;
      });
      this.storeOutDataSource = new MatTableDataSource<{ quantity: number; stock: any }>(this.selectedProducts);
      this.updatetotalQuantity();
    } else {
      this.storeOutFormGroup.controls.quantity.setValue(element.quantity);
      this.snack.open('Quantity entered must less than or equal to Quantity in Store', 'Ok', {
        duration: 3000
      });
    }
  }

  updatetotalQuantity(): void {
    this.totalQuantity = this.storeOutDataSource.data
      .map(x => x.quantity)
      .reduce((a, b) => a + b, 0);
  }

  removeItem($event: MouseEvent, element: { quantity: number, stock: any }): void {
    $event.preventDefault();
    this.selectedProducts = this.selectedProducts.filter(x => x.stock.id !== element.stock.id);
    this.storeOutDataSource = new MatTableDataSource<any>(this.selectedProducts);
    this.updatetotalQuantity();
  }


  async saveStoreOut(): Promise<void> {
    if (this.storeOutDataSource.data.length === 0) {
      this.snack.open('Select Stock to add before submitting', 'Ok', {
        duration: 3000
      });
      return;
    }

  }

}

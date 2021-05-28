import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MessageService, toSqlDate} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {StoreOutSearchComponent} from './store-out-search.component';
import {StoreService} from '../services/store.service';

// @dynamic
@Component({
  selector: 'app-store-out-component',
  template: `
    <div style="margin-top: 36px; margin-bottom: 24px">
      <form *ngIf="storeOutFormGroup" [formGroup]="storeOutFormGroup">
        <h1 style="margin-top: 16px">Items</h1>
        <mat-card>
          <table mat-table [dataSource]="storeOutDataSource">
            <ng-container cdkColumnDef="tag">
              <th mat-header-cell *cdkHeaderCellDef>Product</th>
              <td mat-cell *cdkCellDef="let element">{{element.store.tag}}</td>
              <td mat-footer-cell *cdkFooterCellDef>
                <h2 style="margin: 0; padding: 5px">TOTAL</h2>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="quantity-in-store">
              <th mat-header-cell *cdkHeaderCellDef>Current</th>
              <td mat-cell *cdkCellDef="let element">{{element.store.quantity}}</td>
              <td mat-footer-cell *cdkFooterCellDef>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="quantity">
              <th mat-header-cell *cdkHeaderCellDef>Quantity Out</th>
              <td mat-cell *cdkCellDef="let element">
                <input [id]="element.store.id" style="min-width: 150px" [min]="1" [max]="element.quantity"
                       class="quantity-input"
                       (change)="updateQuantity(element, $event)" type="number" min="1"
                       [value]="element.quantity">
              </td>
              <td mat-footer-cell *cdkFooterCellDef>
                <h1 style="margin: 0; padding: 5px">{{totalQuantity | number}}</h1>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="action">
              <th mat-header-cell *cdkHeaderCellDef>Action</th>
              <td mat-cell *cdkCellDef="let element">
                <span matRipple (click)="removeItem($event, element)">
                  <mat-icon color="warn">delete</mat-icon>
                </span>
              </td>
              <td mat-footer-cell *cdkFooterCellDef>
              </td>
            </ng-container>
            <tr mat-header-row *cdkHeaderRowDef="storeOutTableColumn"></tr>
            <tr mat-row *matRowDef="let row; columns storeOutTableColumn"></tr>
            <tr mat-footer-row *matFooterRowDef="storeOutTableColumn"></tr>
          </table>
        </mat-card>
        <div style="margin-bottom: 16px; display: flex; flex-direction: row; flex-wrap: wrap">
          <button style="margin-top: 24px"
                  [disabled]="saveStoreOutFlag"
                  (click)="addProductToTable($event)" mat-flat-button color="primary">
            <mat-icon matSuffix>add</mat-icon>
            Choose Item
          </button>
          <div style="width: 16px; height: 16px"></div>
          <button style="margin-top: 24px" (click)="saveStoreOut()"
                  [disabled]="showProgress || saveStoreOutFlag" mat-flat-button color="primary">
            <mat-icon matSuffix>done_all</mat-icon>
            {{saveStoreOutFlag === true ? 'Saving...' : 'Submit'}}
            <mat-progress-spinner mode="indeterminate" diameter="20" style="display: inline-block"
                                  *ngIf="showProgress"
                                  color="primary"></mat-progress-spinner>
          </button>
        </div>
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
  storeOutDataSource: MatTableDataSource<{ quantity: number, store: any }> = new MatTableDataSource([]);
  storeOutTableColumn = ['tag', 'quantity-in-store', 'quantity', 'action'];
  selectedProducts: { quantity: number, store: any }[] = [];
  totalQuantity = 0;
  saveStoreOutFlag = false;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly message: MessageService,
              private readonly dialog: MatDialog,
              private router: Router,
              private readonly snack: MatSnackBar,
              private readonly stockService: StoreService) {
  }

  ngOnInit(): void {
    this.storeOutFormGroup = this.formBuilder.group({
      tag: [null, [Validators.required, Validators.nullValidator]],
      quantity: [1, [Validators.required, Validators.nullValidator, Validators.min(1)]],
      dateOut: [new Date(), [Validators.required, Validators.nullValidator]]
    });
  }


  addProductToTable($event: MouseEvent): void {
    $event.preventDefault();
    this.dialog.open(StoreOutSearchComponent).afterClosed().subscribe(value => {
      if (value && value.tag) {
        this.selectedProducts.push({
          quantity: 1,
          store: value
        });
        this.storeOutDataSource = new MatTableDataSource<any>(this.selectedProducts);
        this.updatableQuantity();
      }
    });
  }

  updateQuantity(element: { quantity: number, store: any }, $event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    // @ts-ignore
    const newQuantity = Number($event.target.value);
    if (newQuantity >= 1 && newQuantity <= element.store.quantity) {
      this.selectedProducts = this.selectedProducts.map(x => {
        if (x.store.id === element.store.id) {
          x.quantity = newQuantity;
        }
        return x;
      });
      this.storeOutDataSource = new MatTableDataSource<{ quantity: number; store: any }>(this.selectedProducts);
      this.updatableQuantity();
    } else {
      this.storeOutFormGroup.controls.quantity.setValue(element.quantity);
      this.selectedProducts = this.selectedProducts.map(x => {
        if (x.store.id === element.store.id) {
          x.quantity = element.quantity;
        }
        return x;
      });
      // @ts-ignore
      document.getElementById(element.store.id).value = element.quantity.toString();
      this.storeOutDataSource = new MatTableDataSource<{ quantity: number; store: any }>(this.selectedProducts);
      this.updatableQuantity();
      this.snack.open('Quantity entered must less than or equal to Quantity in Store', 'Ok', {
        duration: 3000
      });
    }
  }

  updatableQuantity(): void {
    this.totalQuantity = this.storeOutDataSource.data
      .map(x => x.quantity)
      .reduce((a, b) => a + b, 0);
  }

  removeItem($event: MouseEvent, element: { quantity: number, store: any }): void {
    $event.preventDefault();
    this.selectedProducts = this.selectedProducts.filter(x => x.store.id !== element.store.id);
    this.storeOutDataSource = new MatTableDataSource<any>(this.selectedProducts);
    this.updatableQuantity();
  }


  async saveStoreOut(): Promise<void> {
    if (this.storeOutDataSource.data.length === 0) {
      this.snack.open('Select Store to add before submitting', 'Ok', {
        duration: 3000
      });
      return;
    } else {
      const saveStoreOutData = [];
      this.storeOutDataSource.filteredData.map(x => {
        saveStoreOutData.push({
          date: toSqlDate(new Date()),
          time: new Date().toISOString().split('T')[1].replace('Z', ''),
          quantity: x.quantity,
          storeId: x.store.id,
          store: x.store,
          tag: x.store.tag
        });
      });
      this.saveStoreOutFlag = true;
      this.stockService.storeOut(saveStoreOutData)
        .then(_ => {
          this.storeOutDataSource = new MatTableDataSource();
          this.totalQuantity = 0;
          this.router.navigateByUrl('/store/item').catch(console.log);
        }).catch(reason => {
        this.snack.open(reason && reason.message ? reason.message : reason.toString(), 'Ok', {
          duration: 2000
        });
      }).finally(() => {
        this.saveStoreOutFlag = false;
      });
    }

  }

}

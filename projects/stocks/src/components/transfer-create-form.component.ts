import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TransferState} from '../states/transfer.state';
import {MessageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';
import {MatDialog} from '@angular/material/dialog';
import {ProductSearchDialogComponent} from './product-search-dialog.component';
import {MatTableDataSource} from "@angular/material/table";
import {StockModel} from "../models/stock.model";

@Component({
  selector: 'smartstock-stock-transfer-create-form',
  template: `
    <div class="">
      <form *ngIf="transferFormGroup" [formGroup]="transferFormGroup" (ngSubmit)="saveTransfer()">
        <h1>Details</h1>
        <mat-card>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Choose a date</mat-label>
            <input matInput formControlName="date" [matDatepicker]="picker">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker [touchUi]="true"></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Select Shop</mat-label>
            <mat-select [multiple]="false" formControlName="to_shop">
              <mat-option [value]="shop"
                          *ngFor="let shop of shops">{{shop.businessName}}</mat-option>
            </mat-select>
            <mat-error>Shop required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="note" rows="3"></textarea>
            <mat-error>Write a transfer node</mat-error>
          </mat-form-field>
        </mat-card>
        <h1 style="margin-top: 16px">Products</h1>
        <div style="margin-bottom: 16px; display: flex; flex-direction: row; flex-wrap: wrap">
          <button (click)="addProductToTable($event)" mat-button color="primary">
            <mat-icon matSuffix>add</mat-icon>
            Add Product
          </button>
          <div style="width: 16px; height: 16px"></div>
          <button mat-flat-button color="primary">
            <mat-icon matSuffix>done_all</mat-icon>
            Submit
          </button>
        </div>
        <mat-card>
          <table mat-table [dataSource]="transfersDatasource">
            <ng-container cdkColumnDef="date">
              <th mat-header-cell *cdkHeaderCellDef>Date</th>
              <td mat-cell *cdkCellDef="let element">{{transferFormGroup.value.date | date}}</td>
            </ng-container>
            <ng-container cdkColumnDef="product">
              <th mat-header-cell *cdkHeaderCellDef>Product</th>
              <td mat-cell *cdkCellDef="let element">{{element.product}}</td>
            </ng-container>
            <ng-container cdkColumnDef="quantity">
              <th mat-header-cell *cdkHeaderCellDef>Quantity</th>
              <td mat-cell *cdkCellDef="let element">
                <input type="number" min="1" value="1">
              </td>
            </ng-container>
            <ng-container cdkColumnDef="action">
              <th mat-header-cell *cdkHeaderCellDef>Action</th>
              <td mat-cell *cdkCellDef="let element">
                <button (click)="removeItem($event, element)" mat-icon-button color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *cdkHeaderRowDef="transfersTableColumn"></tr>
            <tr mat-row *matRowDef="let row; columns transfersTableColumn"></tr>
          </table>
        </mat-card>
      </form>
    </div>
  `
})
export class TransferCreateFormComponent implements OnInit {
  transferFormGroup: FormGroup;
  shops: ShopModel[] = [];
  transfersDatasource: MatTableDataSource<any> = new MatTableDataSource([]);
  transfersTableColumn = ['date', 'product', 'quantity', 'action'];
  selectedProducts: StockModel[] = [];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly message: MessageService,
              private readonly userService: UserService,
              private readonly dialog: MatDialog,
              private readonly transferState: TransferState) {
  }

  ngOnInit(): void {
    this.getOtherShops().catch();
    this.transferFormGroup = this.formBuilder.group({
      date: [new Date(), [Validators.required, Validators.nullValidator]],
      note: ['stock transfer', [Validators.required, Validators.nullValidator]],
      from_shop: [''],
      to_shop: ['', [Validators.required, Validators.nullValidator]],
      transferred_by: [],
      amount: ['', [Validators.required, Validators.nullValidator]],
      items: [[]]
    });
  }

  private async getOtherShops(): Promise<void> {
    try {
      const cShop = await this.userService.getCurrentShop();
      const allShops = await this.userService.getShops();
      this.shops = allShops.filter(x => x.projectId !== cShop.projectId);
    } catch (e) {
      this.shops = [];
    }
  }

  saveTransfer(): void {
    if (this.transferFormGroup.valid) {
      console.log(this.transferFormGroup.value);
      // this.transferState.save(this.transferFormGroup.value);
    } else {
      this.message.showMobileInfoMessage('Please fix all errors then submit again',
        2000, 'bottom');
    }
  }

  addProductToTable($event: MouseEvent): void {
    $event.preventDefault();
    this.dialog.open(ProductSearchDialogComponent).afterClosed().subscribe(value => {
      if (value && value.product) {
        this.selectedProducts.unshift(value);
        this.transfersDatasource = new MatTableDataSource<any>(this.selectedProducts);
        // console.log(this.transfersDatasource.data);
        // this.changeDetector.detectChanges();
      }
    });
  }

  removeItem($event: MouseEvent, element: StockModel): void {
    $event.preventDefault();
    this.selectedProducts = this.selectedProducts.filter(x => x.id !== element.id);
    this.transfersDatasource = new MatTableDataSource<any>(this.selectedProducts);
  }

}

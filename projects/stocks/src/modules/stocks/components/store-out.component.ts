import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MessageService} from '@smartstocktz/core-libs';
import {MatSnackBar} from '@angular/material/snack-bar';

// @dynamic
@Component({
  selector: 'app-store-out-component',
  template: `
    <!--    <div class="">-->
    <!--      <form *ngIf="transferFormGroup" [formGroup]="transferFormGroup">-->
    <!--        <h1>Details</h1>-->
    <!--        <mat-card>-->
    <!--          <mat-label>Choose Customer</mat-label>-->
    <!--          <div class="row" style="padding: 0px 0 0 0">-->
    <!--            <div class="col-lg-6 col-6" style="width: 100%; padding: 10px; margin-left: 0px">-->
    <!--              <mat-form-field style="width:100%" appearance="fill">-->
    <!--                <mat-select style="width:100%" formControlName="customer">-->
    <!--                  <mat-option *ngFor="let option of customers | async" [value]='option.firstName'>-->
    <!--                    {{(option.firstName + " " + option.secondName) + ' @ ' + option.company}}-->
    <!--                  </mat-option>-->
    <!--                </mat-select>-->
    <!--              </mat-form-field>-->
    <!--            </div>-->
    <!--            <div class="col-lg-2 col-2" style="padding-top:6px;">-->
    <!--              <button color="primary" (click)='_getCustomers()' mat-icon-button>-->
    <!--                <mat-icon>refresh</mat-icon>-->
    <!--              </button>-->
    <!--              <button color="primary" (click)='createCustomer()' mat-icon-button>-->
    <!--                <mat-icon>add_circle</mat-icon>-->
    <!--              </button>-->
    <!--            </div>-->
    <!--            <div class="row" style="width: 100%; padding: 10px; margin-left: 0px">-->
    <!--              <mat-form-field appearance="fill">-->
    <!--                <mat-label>Due date</mat-label>-->
    <!--                <input matInput formControlName="dueDate" [matDatepicker]="picker">-->
    <!--                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>-->
    <!--                <mat-datepicker #picker></mat-datepicker>-->
    <!--              </mat-form-field>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <mat-form-field appearance="outline" style="width: 100%; margin-top: 20px">-->
    <!--            <mat-label>Notes</mat-label>-->
    <!--            <textarea matInput formControlName="note" rows="3"></textarea>-->
    <!--            <mat-error>Write an invoice note</mat-error>-->
    <!--          </mat-form-field>-->
    <!--        </mat-card>-->
    <!--        <h1 style="margin-top: 16px">Products</h1>-->
    <!--        <div style="margin-bottom: 16px; display: flex; flex-direction: row; flex-wrap: wrap">-->
    <!--          <button [disabled]="(transferState.isSaveTransfers | async) === true"-->
    <!--                  (click)="addProductToTable($event)"-->
    <!--                  mat-button color="primary">-->
    <!--            <mat-icon matSuffix>add</mat-icon>-->
    <!--            Add Product-->
    <!--          </button>-->
    <!--          <div style="width: 16px; height: 16px"></div>-->
    <!--          <button (click)="saveCreditSale()" [disabled]="showProgress" mat-flat-button color="primary">-->
    <!--            <mat-icon matSuffix>done_all</mat-icon>-->
    <!--            Submit-->
    <!--            <mat-progress-spinner mode="indeterminate" diameter="20" style="display: inline-block"-->
    <!--                                  *ngIf="showProgress"-->
    <!--                                  color="primary"></mat-progress-spinner>-->
    <!--          </button>-->
    <!--        </div>-->
    <!--        <mat-card>-->
    <!--          <table mat-table [dataSource]="transfersDatasource">-->
    <!--            <ng-container cdkColumnDef="product">-->
    <!--              <th mat-header-cell *cdkHeaderCellDef>Product</th>-->
    <!--              <td mat-cell *cdkCellDef="let element">{{element.product.product}}</td>-->
    <!--              <td mat-footer-cell *cdkFooterCellDef>-->
    <!--                <h2 style="margin: 0; padding: 5px">TOTAL</h2>-->
    <!--              </td>-->
    <!--            </ng-container>-->
    <!--            <ng-container cdkColumnDef="quantity">-->
    <!--              <th mat-header-cell *cdkHeaderCellDef>Quantity</th>-->
    <!--              <td mat-cell *cdkCellDef="let element">-->
    <!--                <input class="quantity-input" (change)="updateQuantity(element, $event)" type="number" min="1"-->
    <!--                       [value]="element.quantity">-->
    <!--              </td>-->
    <!--              <td mat-footer-cell *cdkFooterCellDef>-->
    <!--              </td>-->
    <!--            </ng-container>-->
    <!--            <ng-container cdkColumnDef="amount">-->
    <!--              <th mat-header-cell *cdkHeaderCellDef>Amount</th>-->
    <!--              <td mat-cell *cdkCellDef="let element">-->
    <!--                <input class="quantity-input" (change)="updateAmount(element, $event)" type="number" min="0"-->
    <!--                       [value]="element.amount">-->
    <!--              </td>-->
    <!--              <td mat-footer-cell *cdkFooterCellDef>-->
    <!--              </td>-->
    <!--            </ng-container>-->
    <!--            <ng-container cdkColumnDef="subAmount">-->
    <!--              <th mat-header-cell *cdkHeaderCellDef>Sub Amount</th>-->
    <!--              <td mat-cell *cdkCellDef="let element">{{(element.quantity * element.amount) | number}}</td>-->
    <!--              <td mat-footer-cell *cdkFooterCellDef>-->
    <!--                <h1 style="margin: 0; padding: 5px">{{totalCost | number}}</h1>-->
    <!--              </td>-->
    <!--            </ng-container>-->
    <!--            <ng-container cdkColumnDef="action">-->
    <!--              <th mat-header-cell *cdkHeaderCellDef>Action</th>-->
    <!--              <td mat-cell *cdkCellDef="let element">-->
    <!--                <button (click)="removeItem($event, element)" mat-icon-button color="warn">-->
    <!--                  <mat-icon>delete</mat-icon>-->
    <!--                </button>-->
    <!--              </td>-->
    <!--              <td mat-footer-cell *cdkFooterCellDef>-->
    <!--              </td>-->
    <!--            </ng-container>-->
    <!--            <tr mat-header-row *cdkHeaderRowDef="transfersTableColumn"></tr>-->
    <!--            <tr mat-row *matRowDef="let row; columns transfersTableColumn"></tr>-->
    <!--          </table>-->
    <!--        </mat-card>-->
    <!--      </form>-->
    <!--    </div>-->
  `
})
export class StoreOutComponent implements OnInit{
  showProgress = false;
  private currentUser: any;
  creditors: Observable<any[]>;
  customers: Observable<any[]>;
  transferFormGroup: FormGroup;
  transfersDatasource: MatTableDataSource<{ quantity: number, product: StockModel, amount: number }> = new MatTableDataSource([]);
  transfersTableColumn = ['product', 'quantity', 'amount', 'subAmount', 'action'];
  selectedProducts: { quantity: number, product: StockModel, amount: number }[] = [];
  totalCost = 0;

  // constructor(private readonly formBuilder: FormBuilder,
  //             private readonly message: MessageService,
  //             private readonly userService: UserService,
  //             private readonly customerState: CustomerState,
  //             private readonly salesState: SalesState,
  //             private readonly dialog: MatDialog,
  //             private router: Router,
  //             public readonly transferState: TransferState,
  //             public readonly creditorState: CreditorState,
  //             public readonly invoiceState: InvoiceState,
  //             private readonly snack: MatSnackBar) {
  // }

  ngOnInit(): void {
    // this.transferFormGroup = this.formBuilder.group({
    //   date: [new Date(), [Validators.required, Validators.nullValidator]],
    //   dueDate: [new Date(), [Validators.nullValidator]],
    //   note: ['Invoice note', [Validators.nullValidator]],
    //   creditor: [null, [Validators.required, Validators.nullValidator]],
    //   customer: [null, [Validators.required, Validators.nullValidator]],
    //   amount: [null, [Validators.required, Validators.nullValidator]],
    // });
  }


  addProductToTable($event: MouseEvent): void {
    // $event.preventDefault();
    // this.dialog.open(ProductSearchDialogComponent).afterClosed().subscribe(value => {
    //   if (value && value.product) {
    //     this.selectedProducts.unshift({
    //       quantity: 1,
    //       product: value,
    //       amount: 0
    //     });
    //     this.transfersDatasource = new MatTableDataSource<any>(this.selectedProducts);
    //     this.updateTotalCost();
    //   }
    // });
  }

}

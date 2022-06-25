import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { DeviceState, MessageService, toSqlDate } from "smartstock-core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddExpenseSearchDialogComponent } from "./add-expense-search-dialog.component";
import { ExpenseService } from "../services/expense.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { AddExpenseSearchBottomSheetComponent } from "./add-expense-search-bottom-sheet.component";
import { ExpenseModel } from "../models/expense.model";

// @dynamic
@Component({
  selector: "app-add-expense-component",
  template: `
    <div style="margin-top: 36px; margin-bottom: 24px">
      <form *ngIf="storeOutFormGroup" [formGroup]="storeOutFormGroup">
        <h1 style="margin-top: 16px">Items</h1>
        <mat-card>
          <table
            *ngIf="(deviceState.isSmallScreen | async) === false"
            mat-table
            [dataSource]="storeOutDataSource"
          >
            <ng-container cdkColumnDef="name">
              <th mat-header-cell *cdkHeaderCellDef>Item</th>
              <td mat-cell *cdkCellDef="let element">
                {{ element.item.name }}
              </td>
              <td mat-footer-cell *cdkFooterCellDef>
                <h2 style="margin: 0; padding: 5px">TOTAL</h2>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="amount">
              <th mat-header-cell *cdkHeaderCellDef>Amount</th>
              <td mat-cell *cdkCellDef="let element">
                <input
                  [id]="element.item.id"
                  style="min-width: 150px"
                  [min]="1"
                  [max]="element.amount"
                  class="quantity-input"
                  (change)="updateExpenseAmount(element, $event)"
                  type="number"
                  min="1"
                  [value]="element.amount"
                />
              </td>
              <td mat-footer-cell *cdkFooterCellDef>
                <h1 style="margin: 0; padding: 5px">
                  {{ totalQuantity | number }}
                </h1>
              </td>
            </ng-container>
            <ng-container cdkColumnDef="action">
              <th mat-header-cell *cdkHeaderCellDef>Action</th>
              <td mat-cell *cdkCellDef="let element">
                <span matRipple (click)="removeItem($event, element)">
                  <mat-icon color="warn">delete</mat-icon>
                </span>
              </td>
              <td mat-footer-cell *cdkFooterCellDef></td>
            </ng-container>
            <tr mat-header-row *cdkHeaderRowDef="storeOutTableColumn"></tr>
            <tr mat-row *matRowDef="let row; columns: storeOutTableColumn"></tr>
            <tr mat-footer-row *matFooterRowDef="storeOutTableColumn"></tr>
          </table>

          <mat-list *ngIf="(deviceState.isSmallScreen | async) === true">
            <div *ngFor="let item of storeOutDataSource.connect() | async">
              <mat-list-item>
                <h1 matLine>{{ item.item.name }}</h1>
                <div style="margin-bottom: 8px" matLine>
                  <input
                    [id]="item.item.id"
                    style="min-width: 150px"
                    [min]="1"
                    [max]="item.amount"
                    class="quantity-input"
                    (change)="updateExpenseAmount(item, $event)"
                    type="number"
                    min="1"
                    [value]="item.amount"
                  />
                </div>
                <button
                  (click)="removeItem($event, item)"
                  color="warn"
                  matlisticon
                  matSuffix
                  mat-icon-button
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-list-item>
              <mat-divider></mat-divider>
            </div>
            <div>
              <h3 style="margin: 0; padding: 5px">
                TOTAL : {{ totalQuantity | number }}
              </h3>
            </div>
          </mat-list>
        </mat-card>

        <div
          style="margin-bottom: 16px; display: flex; flex-direction: row; flex-wrap: wrap"
        >
          <button
            style="margin-top: 24px"
            [disabled]="saveStoreOutFlag"
            (click)="addExpenseItemToTable($event)"
            mat-flat-button
            color="primary"
          >
            <mat-icon matSuffix>add</mat-icon>
            Choose Item
          </button>
          <div style="width: 16px; height: 16px"></div>
          <button
            style="margin-top: 24px"
            (click)="addExpense()"
            [disabled]="showProgress || saveStoreOutFlag"
            mat-flat-button
            color="primary"
          >
            <mat-icon matSuffix>done_all</mat-icon>
            {{ saveStoreOutFlag === true ? "Saving..." : "Submit" }}
            <mat-progress-spinner
              mode="indeterminate"
              diameter="20"
              style="display: inline-block"
              *ngIf="showProgress"
              color="primary"
            >
            </mat-progress-spinner>
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ["../styles/store-out-component.style.scss"]
})
export class AddExpensesComponent implements OnInit {
  showProgress = false;
  private currentUser: any;
  creditors: Observable<any[]>;
  customers: Observable<any[]>;
  storeOutFormGroup: FormGroup;
  storeOutDataSource: MatTableDataSource<ExpenseModel> = new MatTableDataSource(
    []
  );
  storeOutTableColumn = ["name", "amount", "action"];
  selectedProducts: ExpenseModel[] = [];
  totalQuantity = 0;
  saveStoreOutFlag = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly message: MessageService,
    private readonly dialog: MatDialog,
    private readonly sheet: MatBottomSheet,
    private router: Router,
    private readonly snack: MatSnackBar,
    public readonly deviceState: DeviceState,
    private readonly stockService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.storeOutFormGroup = this.formBuilder.group({
      tag: [null, [Validators.required, Validators.nullValidator]],
      quantity: [
        1,
        [Validators.required, Validators.nullValidator, Validators.min(1)]
      ],
      dateOut: [new Date(), [Validators.required, Validators.nullValidator]]
    });
  }

  addExpenseItemToTable($event: MouseEvent): any {
    $event.preventDefault();
    const isSmallScreen = this.deviceState.isSmallScreen.value;
    if (isSmallScreen) {
      this.sheet
        .open(AddExpenseSearchBottomSheetComponent)
        .afterDismissed()
        .subscribe((value) => {
          if (value && value.name) {
            this.selectedProducts.push({
              amount: 0,
              item: value
            });
            this.storeOutDataSource = new MatTableDataSource<any>(
              this.selectedProducts
            );
            this.updateAmount();
          }
        });
    } else {
      this.dialog
        .open(AddExpenseSearchDialogComponent)
        .afterClosed()
        .subscribe((value) => {
          if (value && value.name) {
            this.selectedProducts.push({
              amount: 0,
              item: value
            });
            this.storeOutDataSource = new MatTableDataSource<any>(
              this.selectedProducts
            );
            this.updateAmount();
          }
        });
    }
  }

  updateExpenseAmount(element: ExpenseModel, $event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    // @ts-ignore
    const newQuantity = Number($event.target.value);
    this.selectedProducts = this.selectedProducts.map((x) => {
      if (x.item.id === element.item.id) {
        x.amount = newQuantity;
      }
      return x;
    });
    this.storeOutDataSource = new MatTableDataSource(this.selectedProducts);
    this.updateAmount();
    // this.storeOutFormGroup.controls.quantity.setValue(element.amount);
    // this.updateAmount();
    // this.snack.open('Quantity entered must less than or equal to Quantity in Store', 'Ok', {
    //   duration: 3000
    // });
  }

  updateAmount(): void {
    this.totalQuantity = this.storeOutDataSource.data
      .map((x) => x.amount)
      .reduce((a, b) => a + b, 0);
  }

  removeItem($event: MouseEvent, element: ExpenseModel): void {
    $event.preventDefault();
    this.selectedProducts = this.selectedProducts.filter(
      (x) => x.item.id !== element.item.id
    );
    this.storeOutDataSource = new MatTableDataSource<any>(
      this.selectedProducts
    );
    this.updateAmount();
  }

  async addExpense(): Promise<void> {
    if (this.storeOutDataSource.data.length === 0) {
      this.snack.open("Select item to add before submitting", "Ok", {
        duration: 3000
      });
      return;
    } else {
      const saveStoreOutData = [];
      this.storeOutDataSource.filteredData.map((x) => {
        saveStoreOutData.push({
          date: toSqlDate(new Date()),
          time: new Date().toISOString().split("T")[1].replace("Z", ""),
          amount: x.amount,
          item: x.item,
          name: x.item.name
        });
      });
      this.saveStoreOutFlag = true;
      this.stockService
        .addExpenses(saveStoreOutData)
        .then((_) => {
          this.storeOutDataSource = new MatTableDataSource();
          this.totalQuantity = 0;
          this.router.navigateByUrl("/expense/report").catch(console.log);
        })
        .catch((reason) => {
          this.snack.open(
            reason && reason.message ? reason.message : reason.toString(),
            "Ok",
            {
              duration: 2000
            }
          );
        })
        .finally(() => {
          this.saveStoreOutFlag = false;
        });
    }
  }
}

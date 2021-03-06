import { Component, OnInit } from "@angular/core";
import { MessageService } from "smartstock-core";
import { MatDialog } from "@angular/material/dialog";
import { ExpenseState } from "../states/expense.state";
import { DialogDeleteComponent } from "./expense.component";

@Component({
  selector: "app-store-products-table-sub-actions",
  template: `
    <mat-card-subtitle>
      <button
        [disabled]="(stockState.isDeleteExpenseItems | async) === true"
        mat-stroked-button
        mat-button
        color="primary"
        class="stockbtn"
        (click)="deleteMany()"
      >
        <mat-icon>cached</mat-icon>
        Delete
        <mat-progress-spinner
          *ngIf="(stockState.isDeleteExpenseItems | async) === true"
          mode="indeterminate"
          color="primary"
          diameter="20px"
          style="display: inline-block"
        >
        </mat-progress-spinner>
      </button>
      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn" (click)="transferStore()">-->
      <!--                        <mat-icon>cached</mat-icon>-->
      <!--                        Store Transfer-->
      <!--                      </button>-->
      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn" (click)="transferStore()">-->
      <!--                        <mat-icon>cached</mat-icon>-->
      <!--                        Store Transfer-->
      <!--                      </button>-->
      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn">-->
      <!--                        <mat-icon>add</mat-icon>-->
      <!--                        Store In-->
      <!--                      </button>-->
      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn">-->
      <!--                        <mat-icon>remove</mat-icon>-->
      <!--                        Store Out-->
      <!--                      </button>-->
      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn">-->
      <!--                        <mat-icon>delete_forever</mat-icon>-->
      <!--                        Dispose Store-->
      <!--                      </button>-->
    </mat-card-subtitle>
  `
})
export class ProductsTableSubActionsComponent implements OnInit {
  constructor(
    private readonly dialog: MatDialog,
    private readonly messageService: MessageService,
    public readonly stockState: ExpenseState
  ) {}

  ngOnInit(): void {}

  deleteMany(): void {
    if (this.stockState.selection.isEmpty()) {
      this.messageService.showMobileInfoMessage(
        "Please select at least one item",
        1000,
        "bottom"
      );
    } else {
      this.dialog
        .open(DialogDeleteComponent, {
          width: "350",
          data: { title: "Products" }
        })
        .afterClosed()
        .subscribe((value) => {
          if (value === "yes") {
            this.stockState.deleteManyExpenseItems(this.stockState.selection);
          } else {
            this.messageService.showMobileInfoMessage(
              "Process cancelled",
              3000,
              "bottom"
            );
          }
        });
    }
  }
}

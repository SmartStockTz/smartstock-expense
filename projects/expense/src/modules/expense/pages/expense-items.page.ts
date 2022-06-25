import { Component, OnInit } from "@angular/core";
import { DeviceState } from "smartstock-core";
import { ExpenseState } from "../states/expense.state";

@Component({
  selector: "app-store",
  template: `
    <app-layout-sidenav
      [leftDrawer]="side"
      [showSearch]="false"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [hasBackRoute]="true"
      backLink="/expense"
      [heading]="'Expense Items'"
      [searchPlaceholder]="'Search..'"
      showSearch="true"
      (searchCallback)="handleSearch($event)"
      [body]="body"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="min-height: 100vh">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-12">
            <div style="margin: 40px 0">
              <app-store-products-table-actions></app-store-products-table-actions>
              <mat-card class="mat-elevation-z3">
                <app-store-products-table></app-store-products-table>
              </mat-card>
            </div>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/store.style.scss"]
})
export class ExpenseItemsPage implements OnInit {
  constructor(
    public readonly stockState: ExpenseState,
    public readonly deviceState: DeviceState
  ) {
    document.title = "SmartStore - Store";
  }

  ngOnInit(): void {}

  handleSearch(query: string): void {
    this.stockState.filter(query);
  }
}

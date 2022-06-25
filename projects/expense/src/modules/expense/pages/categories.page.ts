import { Component, OnDestroy, OnInit } from "@angular/core";
import { DeviceState } from "smartstock-core";

@Component({
  selector: "app-store-categories",
  template: `
    <app-layout-sidenav
      [leftDrawer]="side"
      [body]="body"
      [heading]="'Categories'"
      [showSearch]="false"
      [hasBackRoute]="true"
      backLink="/expense"
      [searchPlaceholder]="'Search...'"
      [showProgress]="false"
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div style="margin: 40px 0; min-height: 100vh">
          <div class="container col-lg-9 col-xl-9 col-sm-11 col-md-10 col-12">
            <app-categories></app-categories>
          </div>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ["../styles/store.style.scss"]
})
export class CategoriesPage implements OnInit, OnDestroy {
  constructor(public readonly deviceState: DeviceState) {
    document.title = "SmartStock - Expense Category";
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}

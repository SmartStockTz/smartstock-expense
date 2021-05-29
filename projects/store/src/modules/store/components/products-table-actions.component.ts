import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {StoreState} from '../states/store.state';

@Component({
  selector: 'app-store-products-table-actions',
  template: `
    <mat-card-title class="d-flex flex-row">
      <button routerLink="/store/item/in" color="primary" class="ft-button" mat-flat-button>
        Add Item
      </button>
      <span class="toolbar-spacer"></span>
      <span style="width: 8px; height: 8px"></span>
      <button (click)="stockState.getStoresFromRemote()"
              [disabled]="(stockState.isFetchStores | async) === true"
              matTooltip="Reload from server"
              color="primary"
              class="ft-button" mat-flat-button>
        <mat-icon *ngIf="(stockState.isFetchStores | async) === false">
          refresh
        </mat-icon>
        <mat-progress-spinner *ngIf="(stockState.isFetchStores | async)===true" [diameter]="20"
                              matTooltip="Fetch products from server"
                              mode="indeterminate"
                              color="primary">
        </mat-progress-spinner>
      </button>
      <span style="width: 8px; height: 8px"></span>
      <!--      <button (click)="exportStore()" [disabled]="(stockState.isExportToExcel | async)===true"-->
      <!--              matTooltip="Export Products To Csv"-->
      <!--              color="primary"-->
      <!--              class="ft-button" mat-flat-button>-->
      <!--        <mat-icon *ngIf="(stockState.isExportToExcel | async) === false">-->
      <!--          cloud_download-->
      <!--        </mat-icon>-->
      <!--        <mat-progress-spinner *ngIf="(stockState.isExportToExcel | async)===true" [diameter]="20"-->
      <!--                              matTooltip="Export Products InProgress.."-->
      <!--                              mode="indeterminate"-->
      <!--                              color="primary">-->
      <!--        </mat-progress-spinner>-->
      <!--      </button>-->
      <!--      <span style="width: 8px; height: 8px"></span>-->
      <!--      <button (click)="importStores()" matTooltip="Import Products" color="primary" class="ft-button"-->
      <!--              mat-flat-button>-->
      <!--        <mat-icon>cloud_upload</mat-icon>-->
      <!--      </button>-->
      <!--      <button [matMenuTriggerFor]="stockMenu" color="primary" mat-icon-button>-->
      <!--        <mat-icon>more_vert</mat-icon>-->
      <!--      </button>-->
      <!--      <mat-menu #stockMenu>-->
      <!--        <button (click)="hotReloadStores()" matTooltip="refresh products in table" mat-menu-item>Hot-->
      <!--          Reload-->
      <!--        </button>-->
      <!--      </mat-menu>-->
    </mat-card-title>
  `
})

export class ProductsTableActionsComponent implements OnInit {

  constructor(private readonly dialog: MatDialog,
              public readonly stockState: StoreState) {
  }

  ngOnInit(): void {

  }

  hotReloadStores(): void {
    this.stockState.getStores();
  }

  exportStore(): void {
    this.stockState.exportToExcel();
  }

}

import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Observable, of, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {LogService, MessageService, StorageService} from '@smartstocktz/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {StockState} from '../states/stock.state';
import {takeUntil} from 'rxjs/operators';
import {StockModel} from '../models/stock.model';
import {MatSidenav} from '@angular/material/sidenav';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DialogDeleteComponent, StockDetailsComponent} from './stock.component';
import {ImportsDialogComponent} from './imports.component';
import {StockService} from '../services/stock.service';
import {StoreOutDetailsComponent} from './store-out-details.component';

@Component({
  selector: 'app-store-report-component',
  template: `
<!--    <div class="row m-0">-->
<!--    <mat-card class="mat-elevation-z3 col-8">-->
      <table mat-table matSort [dataSource]="stockDatasource">

        <ng-container matColumnDef="tag">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Tag</th>
          <td mat-cell *matCellDef="let element">{{element.tag}}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
          <td mat-cell *matCellDef="let element">
            {{(element.category)}}
          </td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date In</th>
          <td mat-cell *matCellDef="let element">
            {{element.date ? (element.date | date) : 'N/A'}}
          </td>
        </ng-container>
        <ng-container matColumnDef="quantityIn">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity In</th>
          <td mat-cell *matCellDef="let element">
            {{(element.quantityIn ? element.quantityIn : 0 | number)}}
          </td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Current Quantity</th>
          <td mat-cell *matCellDef="let element">
            {{(element.quantity | number)}}
          </td>
        </ng-container>
<!--        <ng-container matColumnDef="action">-->
<!--          <th mat-header-cell *matHeaderCellDef>-->
<!--            <div class="d-flex flex-row justify-content-end align-items-end">-->
<!--              <span>Actions</span>-->
<!--            </div>-->
<!--          </th>-->
<!--          <td mat-cell *matCellDef="let element">-->
<!--            <div class="d-flex flex-row flex-nowrap justify-content-end align-items-end">-->
<!--              <button [matMenuTriggerFor]="menu" mat-icon-button>-->
<!--                <mat-icon color="primary">more_vert</mat-icon>-->
<!--              </button>-->
<!--              <mat-menu #menu>-->
<!--                <button mat-menu-item [matTooltip]="'change product information'"-->
<!--                        (click)="viewProduct(element)">View-->
<!--                </button>-->
<!--                <button mat-menu-item [matTooltip]="'change product information'"-->
<!--                        (click)="editStock(element)">Edit-->
<!--                </button>-->
<!--                <button mat-menu-item [matTooltip]="'permanent delete stock'"-->
<!--                        (click)="deleteStock(element)">Delete-->
<!--                </button>-->
<!--              </mat-menu>-->
<!--            </div>-->
<!--          </td>-->
<!--        </ng-container>-->

        <tr mat-header-row *matHeaderRowDef="storeColumns"></tr>
        <tr class="table-data-row" matTooltip="Click for store out details" mat-row
            *matRowDef="let row; columns: storeColumns;" (click)="openStoreDetails(row)"></tr>
      </table>
      <mat-paginator #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                     showFirstLastButtons></mat-paginator>
<!--    </mat-card>-->

<!--    <div class="col-lg-4 col-xl-3 mx-auto">-->
<!--      <h1>Top Categories</h1>-->
<!--    <div *ngFor="let x of [1,2,3,4,5]" class="px-2 mb-4" style="border-top: solid #1b5e20 3px;background: whitesmoke">-->
<!--      <h2 class="m-0 p-2">Category</h2>-->
<!--      <div class="row">-->
<!--        <div class="col-6 mx-0">-->
<!--          <h3 class="m-0">Store In</h3>-->
<!--          <h3 class="row mx-0 align-items-center border-right border-success">-->
<!--          <mat-icon color="primary">arrow_downward</mat-icon>-->
<!--          <span class="mx-auto">3000</span>-->
<!--        </h3>-->
<!--        </div>-->
<!--        <div class="col-6 mx-0">-->
<!--          <h3 class="m-0">Store Out</h3>-->
<!--        <h3 class="row mx-0 align-items-center">-->
<!--          <mat-icon color="primary">arrow_upward</mat-icon>-->
<!--          <span class="mx-auto">3000</span>-->
<!--        </h3>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    </div>-->
<!--    </div>-->
  `
})

export class StoreReportComponent implements OnInit {
  private readonly onDestroy = new Subject<void>();

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              public readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly dialog: MatDialog,
              private readonly messageService: MessageService,
              private readonly stockService: StockService,
              public readonly stockState: StockState) {
  }

  stockDatasource: MatTableDataSource<StockModel> = new MatTableDataSource<StockModel>([]);
  storeColumns = ['tag', 'category', 'date', 'quantityIn', 'quantity'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  ngOnInit(): void {
    this.getStore();
  }

  getStore(): void {
    this.stockService.getAllStore().then(data => {
      data.map(x => {
        this.stockService.getStoreOutByStoreId(x.id).then(storeOut => {
          x.storeOut = storeOut;
          x.quantityIn = x.quantity + storeOut.map(y => y.quantity).reduce((acc, value) => acc + value, 0);
        });
      });
      this.stockDatasource = new MatTableDataSource(data);
      setTimeout(() => {
        this.stockDatasource.paginator = this.paginator;
        this.stockDatasource.sort = this.matSort;
      });
    });
  }

  openStoreDetails(store: any): void {
      this.bottomSheet.open(StoreOutDetailsComponent, {
        data: store,
        closeOnNavigation: true,
      });
  }

}

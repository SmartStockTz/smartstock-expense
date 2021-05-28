import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Observable, of, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {LogService, StorageService} from '@smartstocktz/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {StoreState} from '../states/store.state';
import {takeUntil} from 'rxjs/operators';
import {StoreModel} from '../models/store.model';
import {MatSidenav} from '@angular/material/sidenav';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DialogDeleteComponent, StoreDetailsComponent} from './store.component';
import {ImportsDialogComponent} from './imports.component';

@Component({
  selector: 'app-store-products-table',
  template: `
    <table mat-table matSort [dataSource]="stockDatasource">
      <ng-container matColumnDef="tag">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Tag</th>
        <td mat-cell *matCellDef="let element">{{element.tag}}</td>
      </ng-container>
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
        <td mat-cell *matCellDef="let element">
          {{(element.quantity | number)}}
        </td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
        <td mat-cell *matCellDef="let element">
          {{(element.category)}}
        </td>
      </ng-container>
      <ng-container matColumnDef="date-in">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Date In</th>
        <td mat-cell *matCellDef="let element">
          {{element.date ? (element.date | date) : 'N/A'}}
        </td>
      </ng-container>
      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef>
          <div class="d-flex flex-row justify-content-end align-items-end">
            <span>Actions</span>
          </div>
        </th>
        <td mat-cell *matCellDef="let element">
          <div class="d-flex flex-row flex-nowrap justify-content-end align-items-end">
            <button [matMenuTriggerFor]="menu" mat-icon-button>
              <mat-icon color="primary">more_vert</mat-icon>
            </button>
            <mat-menu #menu>
              <button mat-menu-item [matTooltip]="'change product information'"
                      (click)="viewProduct(element)">View
              </button>
              <button mat-menu-item [matTooltip]="'change product information'"
                      (click)="editStore(element)">Edit
              </button>
              <button mat-menu-item [matTooltip]="'permanent delete store'"
                      (click)="deleteStore(element)">Delete
              </button>
            </mat-menu>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="storeColumns"></tr>
      <tr class="table-data-row" mat-row *matRowDef="let row; columns: storeColumns;"></tr>
    </table>
    <mat-paginator #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                   showFirstLastButtons></mat-paginator>
  `
})

export class ProductsTableComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource();
  private readonly onDestroy = new Subject<void>();

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              public readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly dialog: MatDialog,
              public readonly stockState: StoreState) {
    this.stockState.storeItems.pipe(takeUntil(this.onDestroy)).subscribe(stocks => {
      this.stockDatasource.data = stocks;
      this._getTotalPurchaseOfStore(stocks);
    });
  }

  totalPurchase: Observable<number> = of(0);
  stockDatasource: MatTableDataSource<StoreModel> = new MatTableDataSource<StoreModel>([]);
  storeColumns = ['tag', 'quantity', 'category', 'date-in', 'action'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  ngOnInit(): void {
    this.stockState.getStores().catch(console.log);
  }


  isAllSelected(): boolean {
    if (!this.stockDatasource.data) {
      return false;
    }
    const numSelected = this.stockState.selection.selected.length;
    const numRows = this.stockDatasource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.stockState.selection.clear() :
      this.stockDatasource.data.forEach(row => this.stockState.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.stockState.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  hotReloadStores(): void {
    this.stockState.getStores();
  }

  editStore(element: StoreModel): void {
    this.stockState.selectedStore.next(element);
    this.router.navigateByUrl('/store/item/in/' + element.id).catch(reason => this.logger.e(reason));
  }

  deleteStore(element: StoreModel): void {
    const matDialogRef = this.dialog.open(DialogDeleteComponent, {width: '350', data: {title: element.tag}});
    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this.snack.open('Process cancelled', 'Ok', {duration: 3000});
      } else {
        this.stockState.deleteStore(element);
      }
    });
  }

  viewProduct(store: StoreModel): void {
    this.bottomSheet.open(StoreDetailsComponent, {
      data: store,
      closeOnNavigation: true,
    });
  }

  handleSearch(query: string): void {
    this.stockState.filter(query);
  }

  private _getTotalPurchaseOfStore(stocks: StoreModel[] = []): void {
    const sum = stocks.map(x => {
      if (x.purchase && x.quantity && x.quantity >= 0 && x.purchasable === true) {
        return x.purchase * x.quantity;
      } else {
        return 0;
      }
    }).reduce((a, b) => a + b, 0);
    this.totalPurchase = of(sum);
  }

  exportStore(): void {
    this.stockState.exportToExcel();
  }

  importStores(): void {
    this.dialog.open(ImportsDialogComponent, {
      closeOnNavigation: true,
    });
  }

  ngOnDestroy(): void {
    this.stockState.storeItems.next([]);
    this.onDestroy.next();
  }

  createGroupProduct(): void {
  }

  productValue(): number {
    if (!this.stockDatasource.data) {
      return 0;
    }
    return this.stockState.storeItems.value
      .filter(x => x.stockable === true && x.quantity > 0)
      .map(x => x.purchase * x.quantity)
      .reduce((a, b) => a + b, 0);
  }

  ngAfterViewInit(): void {
    this.stockDatasource.paginator = this.paginator;
    this.stockDatasource.sort = this.matSort;
  }

}

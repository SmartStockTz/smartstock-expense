import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Observable, of, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {DeviceState, LogService, StorageService} from '@smartstocktz/core-libs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ExpenseState} from '../states/expense.state';
import {takeUntil} from 'rxjs/operators';
import {ExpenseItemModel} from '../models/expense-item.model';
import {MatSidenav} from '@angular/material/sidenav';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DialogDeleteComponent, StoreDetailsComponent} from './expense.component';
import {ExpenseModel} from '../models/expense.model';

@Component({
  selector: 'app-store-products-table',
  template: `
    <table *ngIf="(deviceState.isSmallScreen | async)===false" mat-table matSort [dataSource]="stockDatasource">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let element">{{element.name}}</td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
        <td mat-cell *matCellDef="let element">
          {{(element.category)}}
        </td>
      </ng-container>
      <ng-container matColumnDef="created">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
        <td mat-cell *matCellDef="let element">
          {{element.updatedAt ? (element.updatedAt | date) : 'N/A'}}
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
              <button mat-menu-item [matTooltip]="'permanent delete item'"
                      (click)="deleteStore(element)">Delete
              </button>
            </mat-menu>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="storeColumns"></tr>
      <tr class="table-data-row" mat-row *matRowDef="let row; columns: storeColumns;"></tr>
    </table>
    <mat-paginator *ngIf="(deviceState.isSmallScreen | async)===false"
                   #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                   showFirstLastButtons></mat-paginator>

    <mat-nav-list *ngIf="(deviceState.isSmallScreen | async)===true">
      <div *ngFor="let m of stockDatasource.connect() | async">
        <mat-list-item [matMenuTriggerFor]="menum">
          <!--          <p matListIcon>-->
          <!--            <img style="width: 30px; height: 30px; border-radius: 30px"-->
          <!--                 src="{{m.image+'/thumbnail?width=30&height=30'}}" alt="">-->
          <!--          </p>-->
          <h1 matLine>{{m.name}}</h1>
          <p matLine>{{m.createdAt | date}}</p>
          <mat-menu #menum>
            <button mat-menu-item [matTooltip]="'view item information'"
                    (click)="viewProduct(m)">View
            </button>
            <button mat-menu-item [matTooltip]="'change item information'"
                    (click)="editStore(m)">Edit
            </button>
            <button mat-menu-item [matTooltip]="'permanent delete item'"
                    (click)="deleteStore(m)">Delete
            </button>
          </mat-menu>
        </mat-list-item>
        <mat-divider></mat-divider>
      </div>
    </mat-nav-list>
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
              public readonly deviceState: DeviceState,
              public readonly stockState: ExpenseState) {
    this.stockState.expenseItems.pipe(takeUntil(this.onDestroy)).subscribe(stocks => {
      this.stockDatasource.data = stocks;
    });
  }

  totalPurchase: Observable<number> = of(0);
  stockDatasource: MatTableDataSource<ExpenseItemModel> = new MatTableDataSource<ExpenseItemModel>([]);
  storeColumns = ['name', 'category', 'created', 'action'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  ngOnInit(): void {
    this.stockState.getExpenseItems().catch(console.log);
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
    this.stockState.getExpenseItems();
  }

  editStore(element: ExpenseItemModel): void {
    this.stockState.selectedExpenseItem.next(element);
    this.router.navigateByUrl('/expense/item/in/' + element.id).catch(reason => this.logger.e(reason));
  }

  deleteStore(element: ExpenseItemModel): void {
    const matDialogRef = this.dialog.open(DialogDeleteComponent, {width: '350', data: {title: element.name}});
    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this.snack.open('Process cancelled', 'Ok', {duration: 3000});
      } else {
        this.stockState.deleteExpenseItem(element);
      }
    });
  }

  viewProduct(store: ExpenseItemModel): void {
    this.bottomSheet.open(StoreDetailsComponent, {
      data: store,
      closeOnNavigation: true,
    });
  }

  handleSearch(query: string): void {
    this.stockState.filter(query);
  }


  ngOnDestroy(): void {
    this.stockState.expenseItems.next([]);
    this.onDestroy.next();
  }

  createGroupProduct(): void {
  }

  ngAfterViewInit(): void {
    this.stockDatasource.paginator = this.paginator;
    this.stockDatasource.sort = this.matSort;
  }

}

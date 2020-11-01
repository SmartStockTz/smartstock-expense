import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {DeviceInfoUtil, LogService, MessageService, StorageService} from '@smartstocktz/core-libs';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogDeleteComponent, StockDetailsComponent} from '../components/stock.component';
import {StockState} from '../states/stock.state';
import {StockModel} from '../models/stock.model';
import {ImportsDialogComponent} from '../components/imports.component';
import {MatSort} from '@angular/material/sort';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'smartstock-stock-products',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side" [fixedInViewport]="true" #sidenav [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <smartstock-drawer></smartstock-drawer>
      </mat-sidenav>

      <mat-sidenav-content (swiperight)="openDrawer(sidenav)">

        <smartstock-toolbar [heading]="'Products'" [searchPlaceholder]="'Type to search'"
                            showSearch="true"
                            (searchCallback)="handleSearch($event)" [sidenav]="sidenav">
        </smartstock-toolbar>

        <div>

          <div class="container">
            <div class="row" style="margin: 40px 0">
              <div class="full-width col-12">
                <div>
                  <mat-card class="mat-elevation-z3">

                    <mat-card-title class="d-flex flex-row">
                      <button routerLink="/stock/products/create" color="primary" class="ft-button" mat-flat-button>
                        Add Product
                      </button>
                      <span class="toolbar-spacer"></span>
                      <span style="width: 8px; height: 8px"></span>
                      <button (click)="stockState.getStocksFromRemote()"
                              [disabled]="(stockState.isFetchStocks | async) === true"
                              matTooltip="Reload from server"
                              color="primary"
                              class="ft-button" mat-flat-button>
                        <mat-icon *ngIf="(stockState.isFetchStocks | async) === false">
                          refresh
                        </mat-icon>
                        <mat-progress-spinner *ngIf="(stockState.isFetchStocks | async)===true" [diameter]="20"
                                              matTooltip="Fetch products from server"
                                              mode="indeterminate"
                                              color="primary">
                        </mat-progress-spinner>
                      </button>
                      <span style="width: 8px; height: 8px"></span>
                      <button (click)="exportStock()" [disabled]="(stockState.isExportToExcel | async)===true"
                              matTooltip="Export Products To Csv"
                              color="primary"
                              class="ft-button" mat-flat-button>
                        <mat-icon *ngIf="(stockState.isExportToExcel | async) === false">
                          cloud_download
                        </mat-icon>
                        <mat-progress-spinner *ngIf="(stockState.isExportToExcel | async)===true" [diameter]="20"
                                              matTooltip="Export Products InProgress.."
                                              mode="indeterminate"
                                              color="primary">
                        </mat-progress-spinner>
                      </button>
                      <span style="width: 8px; height: 8px"></span>
                      <button (click)="importStocks()" matTooltip="Import Products" color="primary" class="ft-button"
                              mat-flat-button>
                        <mat-icon>cloud_upload</mat-icon>
                      </button>

                      <button [matMenuTriggerFor]="stockMenu" color="primary" mat-icon-button>
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #stockMenu>
                        <button (click)="hotReloadStocks()" matTooltip="refresh products in table" mat-menu-item>Hot
                          Reload
                        </button>
                      </mat-menu>

                    </mat-card-title>

                    <mat-card-subtitle>
                      <button [disabled]="(stockState.isDeleteStocks | async)===true" mat-stroked-button mat-button
                              color="primary" class="stockbtn"
                              (click)="deleteMany()">
                        <mat-icon>cached</mat-icon>
                        Delete
                        <mat-progress-spinner *ngIf="(stockState.isDeleteStocks | async)===true"
                                              mode="indeterminate"
                                              color="primary"
                                              diameter="20px"
                                              style="display: inline-block">
                        </mat-progress-spinner>
                      </button>
                      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn" (click)="transferStock()">-->
                      <!--                        <mat-icon>cached</mat-icon>-->
                      <!--                        Stock Transfer-->
                      <!--                      </button>-->
                      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn" (click)="transferStock()">-->
                      <!--                        <mat-icon>cached</mat-icon>-->
                      <!--                        Stock Transfer-->
                      <!--                      </button>-->
                      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn">-->
                      <!--                        <mat-icon>add</mat-icon>-->
                      <!--                        Stock In-->
                      <!--                      </button>-->
                      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn">-->
                      <!--                        <mat-icon>remove</mat-icon>-->
                      <!--                        Stock Out-->
                      <!--                      </button>-->
                      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn">-->
                      <!--                        <mat-icon>delete_forever</mat-icon>-->
                      <!--                        Dispose Stock-->
                      <!--                      </button>-->
                    </mat-card-subtitle>

                    <table mat-table matSort [dataSource]="stockDatasource">


                      <ng-container matColumnDef="select">
                        <th mat-header-cell *matHeaderCellDef>
                          <mat-checkbox (change)="$event ? masterToggle() : null"
                                        [checked]="selection.hasValue() && isAllSelected()"
                                        [indeterminate]="selection.hasValue() && !isAllSelected()">
                          </mat-checkbox>
                        </th>
                        <td mat-cell *matCellDef="let row">
                          <mat-checkbox (click)="$event.stopPropagation()"
                                        (change)="$event ? selection.toggle(row) : null"
                                        [checked]="selection.isSelected(row)">
                          </mat-checkbox>
                        </td>
                        <td mat-footer-cell *matFooterCellDef>
                          TOTAL
                        </td>
                      </ng-container>


                      <ng-container matColumnDef="product">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
                        <td mat-cell *matCellDef="let element">{{element.product}}</td>
                        <td mat-footer-cell *matFooterCellDef></td>
                      </ng-container>


                      <ng-container matColumnDef="quantity">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
                        <td mat-cell *matCellDef="let element">
                          {{element.stockable ? (element.quantity | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef></td>
                      </ng-container>

                      <ng-container matColumnDef="purchase">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header>Purchase Price</th>
                        <td mat-cell *matCellDef="let element">
                          {{element.purchasable ? (element.purchase | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef="let element">
                          {{productValue() | number}}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="retailPrice">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header>Sale Pice</th>
                        <td matRipple mat-cell *matCellDef="let element">
                          {{element.saleable ? (element.retailPrice | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef></td>
                      </ng-container>

                      <ng-container matColumnDef="wholesalePrice">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header>WholeSale Price</th>
                        <td mat-cell *matCellDef="let element">
                          {{element.saleable ? (element.wholesalePrice | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef></td>
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
                                      (click)="editStock(element)">Edit
                              </button>
                              <button mat-menu-item [matTooltip]="'permanent delete stock'"
                                      (click)="deleteStock(element)">Delete
                              </button>
                            </mat-menu>
                          </div>
                        </td>
                        <td mat-footer-cell *matFooterCellDef></td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
                      <tr matTooltip="{{row.product}}" class="table-data-row"
                          mat-row *matRowDef="let row; columns: stockColumns;">
                      </tr>
                      <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="stockColumns"></tr>
                    </table>
                    <mat-paginator #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                                   showFirstLastButtons></mat-paginator>
                  </mat-card>
                </div>
              </div>
            </div>
          </div>

        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/stock.style.scss']
})
export class ProductsPage extends DeviceInfoUtil implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  private stockSubscription: Subscription;
  private readonly onDestroy = new Subject<void>();

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              public readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly dialog: MatDialog,
              private readonly messageService: MessageService,
              public readonly stockState: StockState) {
    super();
    this.stockState.stocks.pipe(takeUntil(this.onDestroy)).subscribe(stocks => {
      this.stockDatasource.data = stocks;
      this._getTotalPurchaseOfStock(stocks);
    });
  }

  totalPurchase: Observable<number> = of(0);
  stockDatasource: MatTableDataSource<StockModel> = new MatTableDataSource<StockModel>([]);
  stockColumns = ['select', 'product', 'quantity', 'purchase', 'retailPrice', 'wholesalePrice', 'action'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  ngOnInit(): void {
    this.stockState.getStocks();
  }


  isAllSelected(): boolean {
    if (!this.stockDatasource.data) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.stockDatasource.data.length;
    return numSelected === numRows;
    // console.log( numRows);
    // return numSelected;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.stockDatasource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  hotReloadStocks(): void {
    this.stockState.getStocks();
  }

  editStock(element: StockModel): void {
    this.stockState.selectedStock.next(element);
    this.router.navigateByUrl('/stock/products/edit/' + element.id).catch(reason => this.logger.e(reason));
  }

  deleteStock(element: StockModel): void {
    const matDialogRef = this.dialog.open(DialogDeleteComponent, {width: '350', data: {title: element.product}});
    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this.snack.open('Process cancelled', 'Ok', {duration: 3000});
      } else {
        this.stockState.deleteStock(element);
      }
    });
  }

  viewProduct(stock: StockModel): void {
    this.bottomSheet.open(StockDetailsComponent, {
      data: stock,
      closeOnNavigation: true,
    });
  }

  handleSearch(query: string): void {
    this.stockState.filter(query);
  }

  private _getTotalPurchaseOfStock(stocks: StockModel[] = []): void {
    const sum = stocks.map(x => {
      if (x.purchase && x.quantity && x.quantity >= 0 && x.purchasable === true) {
        return x.purchase * x.quantity;
      } else {
        return 0;
      }
    }).reduce((a, b) => a + b, 0);
    this.totalPurchase = of(sum);
  }

  exportStock(): void {
    this.stockState.exportToExcel();
  }

  importStocks(): void {
    this.dialog.open(ImportsDialogComponent, {
      closeOnNavigation: true,
    });
  }

  ngOnDestroy(): void {
    this.stockState.stocks.next([]);
    this.onDestroy.next();
  }

  createGroupProduct(): void {
  }

  productValue(): number {
    if (!this.stockDatasource.data) {
      return 0;
    }
    return this.stockState.stocks.value
      .filter(x => x.stockable === true && x.quantity > 0)
      .map(x => x.purchase * x.quantity)
      .reduce((a, b) => a + b, 0);
  }

  ngAfterViewInit(): void {
    this.stockDatasource.paginator = this.paginator;
    this.stockDatasource.sort = this.matSort;
  }

  deleteMany(): void {
    if (this.selection.isEmpty()) {
      this.messageService.showMobileInfoMessage(
        'Please select at least one item',
        1000,
        'bottom'
      );
    } else {
      this.dialog.open(DialogDeleteComponent, {
        width: '350',
        data: {title: 'Products'}
      }).afterClosed()
        .subscribe(value => {
          if (value === 'yes') {
            this.stockState.deleteManyStocks(this.selection);
          } else {
            this.snack.open('Process cancelled', 'Ok', {duration: 3000});
          }
        });
    }
  }
}





import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {DeviceInfoUtil, EventService, LogService, SsmEvents, StorageService} from '@smartstocktz/core-libs';
import {UnitsModel} from '../models/units.model';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogDeleteComponent, StockDetailsComponent} from '../components/stock.component';
import {StockState} from '../states/stock.state';
import {StockModel} from '../models/stock.model';
import {ImportsDialogComponent} from '../components/imports.component';


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
                            (searchCallback)="handleSearch($event)" [sidenav]="sidenav" [showProgress]="showProgress">
        </smartstock-toolbar>

        <div>

          <div class="container">
            <div class="row" style="margin: 40px 0">
              <div class="full-width col-12">
                <div>
                  <mat-card class="mat-elevation-z3">
                    <mat-card-title class="d-flex flex-row">
                      <button routerLink="/stock/create" color="primary" class="ft-button" mat-flat-button>
                        Add Product
                      </button>
                      <span class="toolbar-spacer"></span>
                      <span style="width: 8px; height: 8px"></span>
                      <button (click)="hotReloadStocks()" [disabled]="hotReloadProgress" matTooltip="Reload from server"
                              color="primary"
                              class="ft-button" mat-flat-button>
                        <mat-icon *ngIf="!hotReloadProgress">refresh</mat-icon>
                        <mat-progress-spinner *ngIf="hotReloadProgress" [diameter]="20"
                                              matTooltip="Fetch products from server"
                                              mode="indeterminate"
                                              color="primary">
                        </mat-progress-spinner>
                      </button>
                      <span style="width: 8px; height: 8px"></span>
                      <button (click)="exportStock()" [disabled]="exportProgress" matTooltip="Export Products To Csv"
                              color="primary"
                              class="ft-button" mat-flat-button>
                        <mat-icon *ngIf="!exportProgress">cloud_download</mat-icon>
                        <mat-progress-spinner *ngIf="exportProgress" [diameter]="20"
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
                        <button (click)="reload()" matTooltip="refresh products in table" mat-menu-item>Reload</button>
                      </mat-menu>

                    </mat-card-title>
                    <mat-card-subtitle>
                      <!--                      <button mat-stroked-button mat-button color="primary" class="stockbtn" (click)="createGroupProduct()">-->
                      <!--                        <mat-icon>cached</mat-icon>-->
                      <!--                        Create Group Product-->
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
                    <table mat-table [dataSource]="stockDatasource">


                      <ng-container matColumnDef="select">
                        <th mat-header-cell *matHeaderCellDef>
                          <mat-checkbox (change)="$event ? masterToggle() : null"
                                        [checked]="selection.hasValue() && isAllSelected()"
                                        [indeterminate]="selection.hasValue() && !isAllSelected()"
                                        [aria-label]="checkboxLabel()">
                          </mat-checkbox>
                        </th>
                        <td mat-cell *matCellDef="let row">
                          <mat-checkbox (click)="$event.stopPropagation()"
                                        (change)="$event ? selection.toggle(row) : null"
                                        [checked]="selection.isSelected(row)" [aria-label]="checkboxLabel(row)">
                          </mat-checkbox>
                        </td>
                        <td mat-footer-cell *matFooterCellDef>
                          TOTAL
                        </td>
                      </ng-container>


                      <ng-container matColumnDef="product">
                        <th mat-header-cell *matHeaderCellDef>Product</th>
                        <td mat-cell *matCellDef="let element">{{element.product}}</td>
                        <td mat-footer-cell *matFooterCellDef>

                        </td>
                      </ng-container>


                      <ng-container matColumnDef="quantity">
                        <th mat-header-cell *matHeaderCellDef>Quantity</th>
                        <td mat-cell *matCellDef="let element">
                          {{element.stockable ? (element.quantity | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef>

                        </td>
                      </ng-container>

                      <ng-container matColumnDef="purchase">
                        <th mat-header-cell *matHeaderCellDef>Purchase Price</th>
                        <td mat-cell *matCellDef="let element">
                          {{element.purchasable ? (element.purchase | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef="let element">
                          {{productValue() | number}}
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="retailPrice">
                        <th mat-header-cell *matHeaderCellDef>Sale Pice</th>
                        <td matRipple mat-cell *matCellDef="let element">
                          {{element.saleable ? (element.retailPrice | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef>

                        </td>
                      </ng-container>

                      <ng-container matColumnDef="wholesalePrice">
                        <th mat-header-cell *matHeaderCellDef>WholeSale Price</th>
                        <td mat-cell *matCellDef="let element">
                          {{element.saleable ? (element.wholesalePrice | number) : 'N/A'}}
                        </td>
                        <td mat-footer-cell *matFooterCellDef>

                        </td>
                      </ng-container>

                      <!--                      <ng-container matColumnDef="expire">-->
                      <!--                        <th mat-header-cell *matHeaderCellDef>Expire</th>-->
                      <!--                        <td mat-cell *matCellDef="let element">{{element.expire | date}}</td>-->
                      <!--                      </ng-container>-->

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
                        <td mat-footer-cell *matFooterCellDef>

                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="stockColumns"></tr>
                      <tr matTooltip="{{row.product}}" class="table-data-row" mat-row
                          *matRowDef="let row; columns: stockColumns;"></tr>
                      <tr mat-footer-row style="font-size: 36px" *matFooterRowDef="stockColumns"></tr>
                    </table>
                    <mat-paginator #paginator [pageSizeOptions]="[10, 20, 100]" showFirstLastButtons></mat-paginator>
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
export class ProductsPage extends DeviceInfoUtil implements OnInit, OnDestroy {
  selectedTab = 0;
  private stockFetchProgress = false;
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

  constructor(private readonly router: Router,
              private readonly indexDb: StorageService,
              public readonly bottomSheet: MatBottomSheet,
              private readonly snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly dialog: MatDialog,
              private readonly eventApi: EventService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly stockDatabase: StockState) {
    super();
  }

  exportProgress = false;
  showProgress = false;
  hotReloadProgress = false;
  totalPurchase: Observable<number> = of(0);
  units: Observable<UnitsModel[]>;
  stockDatasource: MatTableDataSource<StockModel> = new MatTableDataSource<StockModel>([]);
  stockColumns = ['select', 'product', 'quantity', 'purchase', 'retailPrice', 'wholesalePrice', 'action'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(value => {
      if (value) {
        this.selectedTab = Number(value.t);
      }
    });
    this.eventApi.listen(SsmEvents.STOCK_UPDATED, data => {
      this.reload();
    });
    this.initializeView();
  }


  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.stockDatasource.data.length;
    return numSelected === numRows;
    // console.log( numRows);
    // return numSelected;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.stockDatasource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  transferStock(): void {
    // if (this.selection.selected.length === 0) {
    //   this.snack.open('select atleast one product', 'Ok', {duration: 2000});
    // } else {
    //   this.dialog.open(TransferDialogComponent, {
    //     width: '95%',
    //     maxWidth: '600px',
    //     disableClose: true,
    //     closeOnNavigation: true,
    //     data: {
    //       items: this.selection.selected,
    //     }
    //   });
    // }
  }


  private showProgressBar(): void {
    this.showProgress = true;
  }

  private hideProgressBar(): void {
    this.showProgress = false;
  }

  private initializeView(): void {
    this.getStocksFromCache();
  }

  private getStocksFromCache(callback?: (error) => void): void {
    this.stockFetchProgress = true;
    this.indexDb.getStocks().then(stocks => {
      if (!stocks && !Array.isArray(stocks)) {
        this.hotReloadStocks();
        throw new Error('products not available locally');
      }
      if (stocks && Array.isArray(stocks) && stocks.length === 0) {
        this.hotReloadStocks();
        throw new Error('products not available locally');
      }
      this.stockDatasource = new MatTableDataSource(stocks);
      this.stockDatasource.paginator = this.paginator;
      this._getTotalPurchaseOfStock(stocks);
      this.stockFetchProgress = false;
      if (callback) {
        callback(null);
      }
    }).catch(error1 => {
      this.stockFetchProgress = false;
      this.logger.e(error1);
      this.snack.open('Failed to get products', 'Ok', {duration: 3000});
      if (callback) {
        callback(error1);
      }
    });
  }

  hotReloadStocks(): void {
    this.hotReloadProgress = true;
    this.stockDatabase.getAllStock().then(async stocks => {
      try {
        this.hotReloadProgress = false;
        await this.indexDb.saveStocks(stocks);
        this.stockDatasource = new MatTableDataSource(stocks);
        this.stockDatasource.paginator = this.paginator;
        this._getTotalPurchaseOfStock(stocks);
        this.stockFetchProgress = false;
        this.snack.open('Successful retrieve stocks from server', 'Ok', {
          duration: 3000
        });
      } catch (e) {
        throw e;
      }
    }).catch(reason => {
      this.hotReloadProgress = false;
      this.logger.e(reason);
      this.snack.open('Fails to get stocks from server, try again', 'Ok', {
        duration: 3000
      });
    });
  }

  editStock(element: StockModel): void {
    this.router.navigateByUrl('/stock/edit/' + element.id + '?stock=' + encodeURI(JSON.stringify(element)))
      .catch(reason => this.logger.e(reason));
  }

  deleteStock(element: StockModel): void {
    const matDialogRef = this.dialog.open(DialogDeleteComponent, {width: '350', data: element});
    matDialogRef.afterClosed().subscribe(value => {
      if (value === 'no') {
        this.snack.open('Deletion is cancelled', 'Ok', {duration: 3000});
      } else {
        this.showProgressBar();
        this.stockDatabase.deleteStock(element).then(value1 => {
          this.snack.open('Product successful deleted', 'Ok', {duration: 3000});
          this.hideProgressBar();
          // update table
          this._removeProductFromTable(element);
        }).catch(reason => {
          this.logger.e(reason);
          this.snack.open('Product is not deleted successful, try again', 'Ok', {duration: 3000});
          this.hideProgressBar();
        });
      }
    });
  }

  viewProduct(stock: StockModel): void {
    this.bottomSheet.open(StockDetailsComponent, {
      data: stock,
      closeOnNavigation: true,
    });
  }

  // affect performance
  handleSearch(query: string): void {
    this.getStocksFromCache(() => {
      // this.stockDatasource.filter = query.toString().toLowerCase();
      if (query) {
        this.stockDatasource.filter = query.toString().toLowerCase();
      } else {
        this.stockDatasource.filter = '';
      }
    });
  }

  private _removeProductFromTable(element: StockModel): void {
    this.stockDatasource.data = this.stockDatasource.data.filter(value => value.id !== element.id);
    this._getTotalPurchaseOfStock(this.stockDatasource.data);
    // update stocks
    this.indexDb.getStocks().then(stocks => {
      const updatedStock = stocks.filter(value => value.id !== element.id);
      this.indexDb.saveStocks(updatedStock).catch(reason => this.logger.w('Fails to update stock due to deleted item'));
    }).catch(reason => {
      this.logger.w('fails to update stocks to to deleted item');
    });
  }

  private _getTotalPurchaseOfStock(stocks: StockModel[]): void {
    // @ts-ignore
    const sum = stocks.reduce((a, b) => {
      return {purchase: a.purchase + b.purchase}; // returns object with property x
    });
    this.totalPurchase = of(sum.purchase);
  }

  reload(): void {
    this.getStocksFromCache(() => {
    });
  }

  exportStock(): void {
    this.exportProgress = true;
    this.stockDatabase.exportToExcel().then(_ => {
      // const blob = new Blob([value.csv], {type: 'text/plain'});
      // const url = window.URL.createObjectURL(blob);
      // window.open(url);
      this.exportProgress = false;
      this.snack.open('StockModel sent to your email, visit your email to download it', 'Ok', {
        duration: 10000
      });
    }).catch(reason => {
      this.logger.e(reason);
      this.exportProgress = false;
      this.snack.open('Request fails try again later', 'Ok', {
        duration: 3000
      });
    });
  }

  importStocks(): void {
    this.dialog.open(ImportsDialogComponent, {
      closeOnNavigation: true,
    }).afterClosed().subscribe(value => {
      if (value === true) {
        this.hotReloadStocks();
      }
    });
  }

  ngOnDestroy(): void {
    this.eventApi.unListen(SsmEvents.STOCK_UPDATED);
  }

  createGroupProduct(): void {
  }

  productValue(): number {
    return this.stockDatasource
      .data
      .filter(x => x.stockable === true)
      .map(x => x.purchase)
      .reduce((a, b) => a + b, 0);
  }
}




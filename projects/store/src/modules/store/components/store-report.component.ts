import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {StoreState} from '../states/store.state';
import {StoreOutDetailsComponent} from './store-out-details.component';
import {MatSidenav} from '@angular/material/sidenav';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-store-report-component',
  template: `
    <div *ngIf="storeState.isFetchTagWithTrackReport.value === true"
         class="d-flex justify-content-center align-items-center"
         style="height: 100px">
      <mat-progress-spinner mode="indeterminate"
                            [diameter]="30">
      </mat-progress-spinner>
    </div>
    <table *ngIf="storeState.isFetchTagWithTrackReport.value===false"
           mat-table matSort [dataSource]="stockDatasource">
      <!--      <ng-container matColumnDef="sn">-->
      <!--        <th mat-header-cell *matHeaderCellDef mat-sort-header>S.N</th>-->
      <!--        <td mat-cell *matCellDef="let element">{{stockDatasource.data.indexOf(element) + 1}}</td>-->
      <!--      </ng-container>-->
      <ng-container matColumnDef="tag">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Tag</th>
        <td mat-cell *matCellDef="let element">
          {{(element.id)}}
        </td>
      </ng-container>
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
        <td mat-cell *matCellDef="let element">
          {{element.total | number}}
        </td>
      </ng-container>
      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button mat-button color="primary">Details</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="storeColumns"></tr>
      <tr class="table-data-row" matTooltip="Click for  details" mat-row
          *matRowDef="let row; columns: storeColumns;" (click)="openStoreDetails(row)"></tr>
    </table>
    <mat-paginator #paginator pageSize="10" [pageSizeOptions]="[5,10, 20, 100]"
                   showFirstLastButtons></mat-paginator>
  `
})

export class StoreReportComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy = new Subject<void>();
  stockDatasource: MatTableDataSource<any>
    = new MatTableDataSource<{ id: string, total: number, track: { date: string, quantity: number } }>([]);
  storeColumns = ['tag', 'quantity', 'action'];
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  destroy = new Subject();

  constructor(public readonly bottomSheet: MatBottomSheet,
              public readonly storeState: StoreState) {
  }

  ngAfterViewInit(): void {
    this.stockDatasource.paginator = this.paginator;
    this.stockDatasource.sort = this.matSort;
  }

  ngOnInit(): void {
    this.storeState.storeReportByTagWithTrack.pipe(takeUntil(this.destroy)).subscribe(value => {
      if (value) {
        this.stockDatasource = new MatTableDataSource(value);
      }
    });
    this.storeState
      .storeFrequencyGroupByTagWithTracking(this.storeState.reportStartDate.value, this.storeState.reportEndDate.value)
      .catch(console.log);
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }

  openStoreDetails(store: any): void {
    this.bottomSheet.open(StoreOutDetailsComponent, {
      data: store,
      closeOnNavigation: true,
    });
  }

}

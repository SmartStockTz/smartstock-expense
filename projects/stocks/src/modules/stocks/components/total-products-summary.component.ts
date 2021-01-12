import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockState} from '../states/stock.state';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'smartstock-total-products-summary',
  template: `
    <smartstock-dash-card [description]="'number of products you have in stocks'"
                          [title]="'Total Products'"
                          [content]="content">
      <ng-template #content>
        <div
          style="display: flex; height: 100%; flex-direction: column; justify-content: center; align-items: center">
          <h1 *ngIf="(stockState.isFetchStocks | async)===false" style="font-size: 34px">
            {{stockState.totalValidStocks.value | number}}
          </h1>
          <mat-progress-spinner *ngIf="(stockState.isFetchStocks | async)===true" mode="indeterminate" diameter="20"
                                color="primary"></mat-progress-spinner>
        </div>
      </ng-template>
    </smartstock-dash-card>
  `
})
export class TotalProductsSummaryComponent implements OnInit, OnDestroy {
  total = 0;
  destroyer: Subject<any> = new Subject<any>();

  constructor(public readonly stockState: StockState) {
    // this.stockState.stocks.pipe(
    //   takeUntil(this.destroyer)
    // ).subscribe(value => {
    //   this.total = value.length;
    // });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    // this.destroyer.next();
  }
}

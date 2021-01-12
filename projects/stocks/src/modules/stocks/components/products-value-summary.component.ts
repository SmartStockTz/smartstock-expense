import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockState} from '../states/stock.state';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'smartstock-products-value-summary',
  template: `
    <smartstock-dash-card [description]="'non zeros stock values currently'"
                          [title]="'Current Stock Value'"
                          [content]="content">
      <ng-template #content>
        <div
          style="display: flex; height: 100%; flex-direction: column; justify-content: center; align-items: center">
          <h1 *ngIf="(stockState.isFetchStocks | async)=== false" style="font-size: 34px">
            {{stockState.totalValueOfStocks.value | number}}
          </h1>
          <mat-progress-spinner *ngIf="(stockState.isFetchStocks | async)=== true" mode="indeterminate" diameter="20"
                                color="primary"></mat-progress-spinner>
        </div>
      </ng-template>
    </smartstock-dash-card>
  `
})
export class ProductsValueSummaryComponent implements OnInit, OnDestroy {
  totalLoad = false;
  total = 0;
  destroyer: Subject<any> = new Subject<any>();

  constructor(public readonly stockState: StockState) {
    // this.stockState.stocks.pipe(
    //   takeUntil(this.destroyer)
    // ).subscribe(value => {
    //   this.total = value.map(x => {
    //     if (x.quantity > 0) {
    //       return x.quantity * x.purchase;
    //     } else {
    //       return 0;
    //     }
    //   }).reduce((a, b) => a + b, 0);
    // });
  }

  ngOnDestroy(): void {
    // this.destroyer.next();
  }

  ngOnInit(): void {
    // this.stockState.getStocks();
  }
}

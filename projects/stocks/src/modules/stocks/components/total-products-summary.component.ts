import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {StockState} from '../states/stock.state';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-total-products-summary',
  template: `
    <app-dash-card [description]="'number of products you have in stocks'"
                   reportLink="/report/store"
                   [title]="'Store In Today'"
                   [content]="content">
      <ng-template #content>
        <div
          style="display: flex; height: 100%; flex-direction: column; justify-content: center; align-items: center">
          <h1 *ngIf="(stockState.isFetchStocks | async)===false" style="font-size: 34px">
            <!--            {{stockState.totalValidStocks.value | number}}-->
            <app-animate-digit [digit]="stockState.totalValidStocks.value" [duration]="1000"></app-animate-digit>

          </h1>
          <mat-progress-spinner *ngIf="(stockState.isFetchStocks | async)===true" mode="indeterminate" diameter="20"
                                color="primary"></mat-progress-spinner>
        </div>
      </ng-template>
    </app-dash-card>
  `
})
export class TotalProductsSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  total = 0;
  destroyer: Subject<any> = new Subject<any>();
  animationTime = 0;

  constructor(public readonly stockState: StockState) {
    // this.stockState.stocks.pipe(
    //   takeUntil(this.destroyer)
    // ).subscribe(value => {
    //   this.total = value.length;
    // });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.animateValue(0, this.stockState.totalValidStocks.value, 2000);
  }

  animateValue(start, end, duration): any {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) { startTimestamp = timestamp; }
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      if (progress < 1 || !this.stockState.isFetchStocks) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    // this.destroyer.next();
  }
}

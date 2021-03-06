import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ExpenseState} from '../states/expense.state';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-products-value-summary',
  template: `
    <app-dash-card [description]="'non zeros item values currently'"
                   [title]="''"
                   [content]="content">
      <ng-template #content>
        <div
          style="display: flex; height: 100%; flex-direction: column; justify-content: center; align-items: center">
          <h1 *ngIf="(stockState.isFetchExpenseItems | async)=== false" style="font-size: 34px">
            <app-animate-digit [digit]="stockState.totalValueOfStores.value"
                               [duration]="1000"></app-animate-digit>
          </h1>
          <mat-progress-spinner *ngIf="(stockState.isFetchExpenseItems | async)=== true" mode="indeterminate"
                                diameter="20"
                                color="primary"></mat-progress-spinner>
        </div>
      </ng-template>
    </app-dash-card>
  `
})
export class ProductsValueSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  totalLoad = false;
  total = 0;
  destroyer: Subject<any> = new Subject<any>();

  constructor(public readonly stockState: ExpenseState) {
    // this.storeState.expenseItems.pipe(
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

  ngOnInit(): void {
    this.stockState.getStoreSummary().then(value => {
      console.log(value);
    });
  }

  ngAfterViewInit(): void {
    this.animateValue(0, this.stockState.totalValidStores.value, 2000);
  }

  animateValue(start, end, duration): any {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      if (progress < 1 || !this.stockState.isFetchExpenseItems) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    // this.destroyer.next();
  }

}

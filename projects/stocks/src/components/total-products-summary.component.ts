import {Component, OnInit} from '@angular/core';
import {StockState} from '../states/stock.state';

@Component({
  selector: 'smartstock-total-products-summary',
  template: `
    <smartstock-dash-card [description]="'number of products you have in stocks'"
                          [title]="'Total Products'"
                          [content]="content">
      <ng-template #content>
        <div
          style="display: flex; height: 100%; flex-direction: column; justify-content: center; align-items: center">
          <h1 *ngIf="!totalLoad" style="font-size: 34px">
            {{total | number}}
          </h1>
          <mat-progress-spinner *ngIf="totalLoad" mode="indeterminate" diameter="20"
                                color="primary"></mat-progress-spinner>
        </div>
      </ng-template>
    </smartstock-dash-card>
  `
})
export class TotalProductsSummaryComponent implements OnInit {
  totalLoad = false;
  total = 0;

  constructor(private readonly stockState: StockState) {
  }

  ngOnInit(): void {
    this.stockState.stocks.subscribe(value => {
      this.total = value.length;
    });
    this.stockState.getStocks();
  }
}

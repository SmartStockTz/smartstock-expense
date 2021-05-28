import {Component, OnInit} from '@angular/core';
import {StoreState} from '../states/store.state';
import {Chart, chart} from 'highcharts';

@Component({
  selector: 'app-store-by-tag-report',
  template: `
    <div style="height: 100%" class="d-flex justify-content-center align-items-center">
      <div style="width: 100%; height: 100%" id="storeByTagReport"></div>
      <app-data-not-ready style="position: absolute" [width]="100" height="100"
                          [isLoading]="storeState.isFetchTagReport | async"
                          *ngIf="storeState.isFetchTagReport.value">
      </app-data-not-ready>
    </div>
  `
})
export class StoreReportByTagComponent implements OnInit {
  stockByCategoryStatus: { x: string, y: number }[];
  stockByCategoryChart: Chart = undefined;

  constructor(public readonly storeState: StoreState) {
  }

  async ngOnInit(): Promise<any> {
    this.storeState.storeReportByTag.subscribe(value => {
      this.initiateGraph(value);
    });
    this.storeState.storeFrequencyGroupByTag(this.storeState.reportStartDate.value,
      this.storeState.reportEndDate.value).catch(console.log);
    // .then(value => {
    //   this.initiateGraph(value);
    // });
  }

  private initiateGraph(data: { id: string, total: number }[]): any {
    const x: string[] = data.map(value => value.id);
    const y: any[] = data.map(value => {
      return {
        y: value.total,
        name: value.id
      };
    });
    this.stockByCategoryChart = chart(
      'storeByTagReport',
      {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          type: 'pie',
          color: '#0b2e13',
          data: y,
        }],
      },
      _1 => {
        // console.log(_1);
      }
    );
  }
}

import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {StoreState} from '../states/store.state';
import {FormControl} from '@angular/forms';
import {StoreModel} from '../models/store.model';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-store-products-search-dialog',
  template: `
    <div>
      <div mat-dialog-title>
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
          <input placeholder="Search product..." [formControl]="searchFormControl" class="search-input"
                 style="flex-grow: 1;">
          <div style="width: 20px; height: auto"></div>
          <button [disabled]="(storeState.isFetchStores | async)===true" (click)="getProducts()" mat-flat-button
                  color="primary" style="flex-grow: 0">
            <mat-icon *ngIf="(storeState.isFetchStores | async)===false">refresh</mat-icon>
            <mat-progress-spinner *ngIf="(storeState.isFetchStores | async)===true"
                                  mode="indeterminate" diameter="20"
                                  color="primary"
                                  style="display: inline-block">
            </mat-progress-spinner>
          </button>
        </div>
      </div>
      <div mat-dialog-content>
        <cdk-virtual-scroll-viewport [itemSize]="50" style="height: 300px">
          <div *cdkVirtualFor="let store of storeState.storeItems | async ">
            <div style="display: flex; flex-direction: row; flex-wrap: nowrap" (click)="selectProduct(store)">
              <p style="flex-grow: 1; margin: 0; padding: 4px; text-align: start; display: flex; align-items: center">
                {{store.tag}}
              </p>
              <div style="width: 20px; height: auto"></div>
              <button mat-button color="primary" style="flex-grow: 0;margin: 4px">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <mat-divider></mat-divider>
          </div>
        </cdk-virtual-scroll-viewport>
      </div>
      <div mat-dialog-actions>
        <button mat-button color="warn" mat-dialog-close>Close</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/store-out-search.style.scss']
})

export class StoreOutSearchComponent implements OnInit {
  searchFormControl = new FormControl('');
  storeData;

  constructor(public readonly dialogRef: MatDialogRef<StoreOutSearchComponent>,
              public readonly storeState: StoreState) {
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500)
      ).subscribe(value => {
      this.storeState.filter(value);
    });
    this.storeState.getStores().then(data => {
      this.storeData = data;
    });
  }

  getProducts(): void {
    this.storeState.getStoresFromRemote();
  }

  selectProduct(store): void {
    this.dialogRef.close(store);
  }
}

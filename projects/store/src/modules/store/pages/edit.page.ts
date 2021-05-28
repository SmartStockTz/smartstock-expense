import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StoreModel} from '../models/store.model';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {StoreState} from '../states/store.state';

@Component({
  selector: 'app-store-edit',
  template: `
    <app-store-in [isLoadingData]="loadStore" [isUpdateMode]="true"
                          [initialStore]="store"></app-store-in>
  `,
  styleUrls: ['../styles/edit.style.scss']
})
export class EditPageComponent extends DeviceInfoUtil implements OnInit {

  store: StoreModel;
  loadStore = false;

  constructor(private readonly stockState: StoreState,
              private readonly router: Router,
              private readonly snack: MatSnackBar) {
    super();
    document.title = 'SmartStock - Edit Store Item';
  }

  ngOnInit(): void {
    this.getStore();
  }

  getStore(): void {
    this.loadStore = true;
    if (this.stockState.selectedStore.value) {
      this.store = this.stockState.selectedStore.value;
    } else {
      this.snack.open('Fails to get store for update', 'Ok', {
        duration: 3000
      });
      this.router.navigateByUrl('/store').catch();
    }
    this.loadStore = false;
  }
}

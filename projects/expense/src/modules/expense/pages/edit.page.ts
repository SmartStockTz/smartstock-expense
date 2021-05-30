import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExpenseItemModel} from '../models/expense-item.model';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';
import {ExpenseState} from '../states/expense.state';

@Component({
  selector: 'app-store-edit',
  template: `
    <app-store-in [isLoadingData]="loadStore" [isUpdateMode]="true"
                          [initialStore]="store"></app-store-in>
  `,
  styleUrls: ['../styles/edit.style.scss']
})
export class EditPageComponent extends DeviceInfoUtil implements OnInit {

  store: ExpenseItemModel;
  loadStore = false;

  constructor(private readonly stockState: ExpenseState,
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
    if (this.stockState.selectedExpenseItem.value) {
      this.store = this.stockState.selectedExpenseItem.value;
    } else {
      this.snack.open('Fails to get item for update', 'Ok', {
        duration: 3000
      });
      this.router.navigateByUrl('/item').catch();
    }
    this.loadStore = false;
  }
}

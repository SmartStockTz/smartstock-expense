import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExpenseItemModel} from '../models/expense-item.model';
import {} from '@smartstocktz/core-libs';
import {ExpenseState} from '../states/expense.state';

@Component({
  selector: 'app-store-edit',
  template: `
      <app-expense-item [isLoadingData]="loadStore" [isUpdateMode]="true"
                        [initialStore]="store"></app-expense-item>
  `,
  styleUrls: ['../styles/edit.style.scss']
})
export class EditPageComponent implements OnInit {

  store: ExpenseItemModel;
  loadStore = false;

  constructor(private readonly stockState: ExpenseState,
              private readonly router: Router,
              private readonly snack: MatSnackBar) {
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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StockModel} from '../models/stock.model';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'smartstock-stock-edit',
  template: `
    <smartstock-stock-new *ngIf="!loadStock" [isUpdateMode]="true" [initialStock]="stock"></smartstock-stock-new>
  `,
  styleUrls: ['../styles/edit.style.scss']
})
export class EditPageComponent extends DeviceInfoUtil implements OnInit {

  updateForm: FormGroup;
  mainProgress = false;
  stock: StockModel;
  loadStock = false;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly snack: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.getStock();
  }

  getStock() {
    this.loadStock = true;
    this.activatedRoute.queryParams.subscribe(value => {
      if (value && value.stock) {
        this.loadStock = false;
        this.stock = JSON.parse(value.stock);
      } else {
        this.loadStock = false;
        this.snack.open('Fails to get stock for update', 'Ok', {
          duration: 3000
        });
      }
    });
  }
}

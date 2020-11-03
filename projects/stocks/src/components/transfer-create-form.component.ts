import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TransferState} from '../states/transfer.state';
import {MessageService, UserService} from '@smartstocktz/core-libs';
import {ShopModel} from '../models/shop.model';

@Component({
  selector: 'smartstock-stock-transfer-create-form',
  template: `
    <div class="">
      <form *ngIf="transferFormGroup" [formGroup]="transferFormGroup" (ngSubmit)="saveTransfer()">
        <h1>Details</h1>
        <mat-card>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Choose a date</mat-label>
            <input matInput formControlName="date" [matDatepicker]="picker">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker [touchUi]="true"></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Select Shop</mat-label>
            <mat-select [multiple]="false" formControlName="to_shop">
              <mat-option [value]="shop"
                          *ngFor="let shop of shops">{{shop.businessName}}</mat-option>
            </mat-select>
            <mat-error>Shop required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" style="width: 100%">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="note" rows="3"></textarea>
            <mat-error>Write a transfer node</mat-error>
          </mat-form-field>
        </mat-card>
        <h1 style="margin-top: 16px">Products</h1>
        <mat-card>

        </mat-card>
      </form>
    </div>
  `
})
export class TransferCreateFormComponent implements OnInit {
  transferFormGroup: FormGroup;
  shops: ShopModel[] = [];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly message: MessageService,
              private readonly userService: UserService,
              private readonly transferState: TransferState) {
  }

  ngOnInit(): void {
    this.getOtherShops();
    this.transferFormGroup = this.formBuilder.group({
      date: [],
      note: [],
      from_shop: [],
      to_shop: [],
      transferred_by: [],
      amount: [],
      items: []
    });
  }

  private async getOtherShops(): Promise<void> {
    try {
      const cShop = await this.userService.getCurrentShop();
      const allShops = await this.userService.getShops();
      this.shops = allShops.filter(x => x.projectId !== cShop.projectId);
    } catch (e) {
      this.shops = [];
    }
  }

  saveTransfer(): void {
    if (this.transferFormGroup.valid) {
      console.log(this.transferFormGroup.value);
      // this.transferState.save(this.transferFormGroup.value);
    } else {
      this.message.showMobileInfoMessage('Please fix all errors then submit again',
        2000, 'bottom');
    }
  }
}

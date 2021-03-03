import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {SupplierService} from '../services/supplier.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {SupplierCreateFormBottomSheetComponent} from './supplier-create-form-bottom-sheet.component';

@Component({
  selector: 'app-suppliers-form-field',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field *ngIf="purchasable === true" appearance="outline"
                      class="my-input">
        <mat-label>Supplier</mat-label>
        <mat-select [multiple]="false" formControlName="supplier">
          <mat-option *ngFor="let supplier of suppliers | async" [value]="supplier.name">
            {{supplier.name}}
          </mat-option>
        </mat-select>
        <mat-progress-spinner matTooltip="Fetching suppliers"
                              *ngIf="suppliersFetching" matSuffix color="accent"
                              mode="indeterminate"
                              [diameter]="20"></mat-progress-spinner>
        <mat-error>Supplier required</mat-error>
        <div matSuffix class="d-flex flex-row">
          <button (click)="refreshSuppliers($event)" mat-icon-button matTooltip="refresh suppliers"
                  *ngIf="!suppliersFetching">
            <mat-icon>refresh</mat-icon>
          </button>
          <button (click)="addNewSupplier($event)" mat-icon-button matTooltip="add new supplier"
                  *ngIf="!suppliersFetching">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-form-field>
    </div>
  `
})

export class SuppliersFormFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() purchasable = true;
  suppliers: Observable<any[]>;
  suppliersFetching = true;

  constructor(private readonly supplierService: SupplierService,
              private readonly bottomSheet: MatBottomSheet,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.suppliersFetching = true;
    this.supplierService.getAllSupplier({}).then(value => {
      this.suppliersFetching = false;
      this.suppliers = of(JSON.parse(JSON.stringify(value)));
    }).catch(_ => {
      this.suppliersFetching = false;
      this.suppliers = of([{name: 'Default'}]);
    });
  }

  addNewSupplier($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.bottomSheet.open(SupplierCreateFormBottomSheetComponent, {
      data: {
        supplier: null
      }
    }).afterDismissed().subscribe(value => {
      this.getSuppliers();
    });
    // this.dialog.open(SupplierCreateFormComponent, {
    //   closeOnNavigation: true
    // }).afterClosed().subscribe(value => {
    //   if (value) {
    //     this.getSuppliers();
    //   }
    // });
  }

  refreshSuppliers($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.getSuppliers();
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupplierService} from '../services/supplier.service';
import {MatDialog} from '@angular/material/dialog';
import {FileBrowserDialogComponent, StorageService} from '@smartstocktz/core-libs';
import {SupplierModel} from '../models/supplier.model';
import {MetasModel} from '../models/metas.model';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'smartstock-stock-supplier-create-form',
  template: `
    <div style="margin-bottom: 100px">
      <form class="d-flex flex-column" [formGroup]="newSupplierForm" (ngSubmit)="createSupplier()">

        <h2>
          Image
        </h2>
        <mat-card style="margin-bottom: 8px">
          <img alt="Supplier Image" mat-card-image [src]="newSupplierForm.value.image">
          <mat-card-actions>
            <button (click)="mediaBrowser($event)" mat-button color="primary">
              Upload
            </button>
          </mat-card-actions>
        </mat-card>

        <h2>
          Details
        </h2>
        <mat-card style="margin-bottom: 8px">
          <mat-form-field style="width: 100%" appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput type="text" formControlName="name" required>
            <mat-error>Name required</mat-error>
          </mat-form-field>

          <mat-form-field style="width: 100%" appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email">
            <mat-error>Email required</mat-error>
          </mat-form-field>

          <mat-form-field style="width: 100%" appearance="outline">
            <mat-label>Mobile</mat-label>
            <input matInput formControlName="number">
            <mat-error>Mobile required</mat-error>
          </mat-form-field>

          <mat-form-field style="width: 100%" appearance="outline">
            <mat-label>Address</mat-label>
            <textarea matInput formControlName="address" rows="2"></textarea>
            <mat-error>Address required</mat-error>
          </mat-form-field>
        </mat-card>

        <h2>
          Other Attributes
        </h2>
        <smartstock-stock-metas-form-field [formGroup]="newSupplierForm"
                                           [metas]="metasModel"></smartstock-stock-metas-form-field>

        <div style="height: 24px"></div>

        <button color="primary" [disabled]="createSupplierProgress" mat-flat-button class="ft-button">
          {{supplier ? 'Update' : 'Save'}}
          <mat-progress-spinner style="display: inline-block"
                                *ngIf="createSupplierProgress"
                                [diameter]="20"
                                mode="indeterminate">
          </mat-progress-spinner>
        </button>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 24px" *ngIf="bottomRef">
          <button (click)="close($event)" mat-button color="warn">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class SupplierCreateFormComponent implements OnInit {
  newSupplierForm: FormGroup;
  createSupplierProgress = false;
  @Input() supplier: SupplierModel;
  @Input() bottomRef: MatBottomSheetRef;
  metasModel: BehaviorSubject<MetasModel[]> = new BehaviorSubject([]);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly supplierService: SupplierService) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm(): void {
    if (this.supplier && this.supplier.metas) {
      this.metasModel.next(Object.keys(this.supplier.metas).map<MetasModel>(x => {
        return {
          name: x,
          value: this.supplier.metas[x],
          type: typeof this.supplier.metas[x]
        };
      }));
    }
    this.newSupplierForm = this.formBuilder.group({
      image: [this.supplier && this.supplier.image ? this.supplier.image : ''],
      name: [this.supplier && this.supplier.name ? this.supplier.name : '', [Validators.nullValidator, Validators.required]],
      email: [this.supplier && this.supplier.email ? this.supplier.email : ''],
      number: [this.supplier && this.supplier.number
        ? this.supplier.number
        : '', [Validators.nullValidator, Validators.required]],
      address: [this.supplier && this.supplier.address
        ? this.supplier.address
        : '', [Validators.nullValidator, Validators.required]],
      metas: this.supplier && this.supplier.metas
        ? this.getMetaFormGroup(this.supplier.metas)
        : this.formBuilder.group({})
    });
  }

  createSupplier(): void {
    if (!this.newSupplierForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.createSupplierProgress = true;
    this.supplierService.addSupplier(
      this.newSupplierForm.value,
      this.supplier && this.supplier.id ? this.supplier.id : null).then(_ => {
      this.createSupplierProgress = false;
      this.snack.open('Supplier Updated', 'Ok', {
        duration: 2000
      });
      if (this.bottomRef) {
        this.bottomRef.dismiss(true);
      } else {
        this.router.navigateByUrl('/stock/suppliers').catch(_2 => {
        });
      }
    }).catch(_ => {
      this.createSupplierProgress = false;
      this.snack.open(_ && _.message ? _.message : 'Supplier not updated, try again', 'Ok', {
        duration: 2000
      });
    });
  }

  cancel($event: Event): void {
    $event.preventDefault();
  }

  async mediaBrowser($event: MouseEvent): Promise<void> {
    $event.preventDefault();
    this.dialog.open(FileBrowserDialogComponent, {
      closeOnNavigation: false,
      disableClose: false,
      data: {
        shop: await this.storage.getActiveShop()
      }
    }).afterClosed().subscribe(value => {
      if (value && value.url) {
        this.newSupplierForm.get('image').setValue(value.url);
      }
    });
  }

  private getMetaFormGroup(metas: { [p: string]: any }): FormGroup {
    const fg = this.formBuilder.group({});
    Object.keys(metas).forEach(key => {
      fg.setControl(key, this.formBuilder.control(metas[key]));
    });
    return fg;
  }

  close($event: MouseEvent): void {
    $event.preventDefault();
    this.bottomRef.dismiss(false);
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {StockModel} from '../models/stock.model';
import {DeviceInfoUtil, FileBrowserDialogComponent, StorageService} from '@smartstocktz/core-libs';
import {StockService} from '../services/stock.service';
import {MetasModel} from '../models/metas.model';

@Component({
  selector: 'app-store-out',
  template: `
    <mat-sidenav-container class="match-parent">
      <mat-sidenav class="match-parent-side"
                   [fixedInViewport]="true"
                   #sidenav
                   [mode]="enoughWidth()?'side':'over'"
                   [opened]="enoughWidth()">
        <app-drawer></app-drawer>
      </mat-sidenav>

      <mat-sidenav-content>

        <app-toolbar [heading]="isUpdateMode?'Update Product':'Store Out'"
                     [sidenav]="sidenav"
                     backLink="/stock/products"
                     [showProgress]="false">
        </app-toolbar>

        <div class="col-11 col-xl-9 col-lg-9 col-md-10 col-sm-11 mx-auto">
          <app-store-out-component></app-store-out-component>
<!--            <form *ngIf="!isLoadingData" [formGroup]="productForm" #formElement="ngForm"-->
<!--                  (ngSubmit)="isUpdateMode?updateProduct(formElement):addProduct(formElement)">-->

<!--              <div class="row d-flex justify-content-center align-items-center">-->
<!--                <div class="col-11 col-xl-9 col-lg-9 col-md-10 col-sm-11">-->
<!--                    <mat-card class="card-wrapper">-->
<!--                      <mat-card-content class="card-content row p-3">-->
<!--                        <mat-form-field appearance="outline"-->
<!--                                        class="my-input">-->
<!--                          <mat-label>Product Code</mat-label>-->
<!--                          <input matInput type="text" required formControlName="purchase">-->
<!--                          <mat-error>Product Code required</mat-error>-->
<!--                        </mat-form-field>-->
<!--                        <mat-form-field appearance="outline" class="my-input"-->
<!--                                        matTooltip="Quantity">-->
<!--                          <mat-label>Quantity</mat-label>-->
<!--                          <input min="0" matInput-->
<!--                                 type="number"-->
<!--                                 required formControlName="wholesaleQuantity">-->
<!--                          <mat-error>Quantity required</mat-error>-->
<!--                        </mat-form-field>-->
<!--                      </mat-card-content>-->

<!--                  <div class="col-11 col-xl-5 col-lg-5 col-md-6 col-sm-11 mx-auto">-->
<!--                    <div>-->
<!--                      <button class="btn-block ft-button" color="primary" mat-raised-button-->
<!--                              [disabled]="mainProgress">Store Out-->
<!--                        <mat-progress-spinner style="display: inline-block" *ngIf="mainProgress" diameter="30"-->
<!--                                              mode="indeterminate"></mat-progress-spinner>-->
<!--                      </button>-->
<!--                      <div style="padding: 16px 0">-->
<!--                        <button class="btn-block ft-button" routerLink="/stock" color="primary" mat-button>-->
<!--                          Cancel-->
<!--                        </button>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  </mat-card>-->
<!--                </div>-->


<!--              </div>-->
<!--            </form>-->
        </div>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/create.style.scss']
})
export class StoreOutPage extends DeviceInfoUtil implements OnInit {

  @Input() isUpdateMode = false;
  @Input() initialStock: StockModel;
  @Input() isLoadingData = false;
  metasModel: BehaviorSubject<MetasModel[]> = new BehaviorSubject([]);
  productForm: FormGroup;
  metas: Observable<{
    type: string;
    label: string;
    controlName: string;
  }[]>;
  mainProgress = false;
  uploadPercentage = 0;
  uploadTag = '';

  constructor(private readonly formBuilder: FormBuilder,
              private readonly snack: MatSnackBar,
              private readonly dialog: MatDialog,
              private readonly router: Router,
              private readonly storageService: StorageService,
              private readonly stockService: StockService) {
    super();
    document.title = 'SmartStock - Product Create';
  }

  ngOnInit(): void {
    this.initializeForm(this.initialStock);
    this.metas = of([]);
  }

  initializeForm(stock?: StockModel): void {
    if (stock && stock.metas) {
      this.metasModel.next(Object.keys(stock.metas).map<MetasModel>(x => {
        return {
          name: x,
          value: stock.metas[x],
          type: typeof stock.metas[x]
        };
      }));
    }
    this.productForm = this.formBuilder.group({
      image: [stock && stock.image ? stock.image : ''],
      product: [stock && stock.product ? stock.product : '', [Validators.nullValidator, Validators.required]],
      barcode: [stock && stock.barcode ? stock.barcode : ''],
      saleable: [stock && stock.saleable !== undefined ? stock.saleable : true],
      downloadable: [stock && stock.downloadable !== undefined ? stock.downloadable : false],
      downloads: [stock && stock.downloads ? stock.downloads : []],
      stockable: [stock && stock.stockable !== undefined ? stock.stockable : false],
      purchasable: [stock && stock.purchasable !== undefined ? stock.purchasable : false],
      description: [stock && stock.description ? stock.description : ''],
      purchase: [stock && stock.purchase ? stock.purchase : 0, [Validators.nullValidator, Validators.required]],
      retailPrice: [stock && stock.retailPrice ? stock.retailPrice : 0, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [stock && stock.wholesalePrice ? stock.wholesalePrice : 0, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [stock && stock.wholesaleQuantity ? stock.wholesaleQuantity : 0, [Validators.nullValidator, Validators.required]],
      quantity: [stock && stock.quantity ? stock.quantity : 0, [Validators.nullValidator, Validators.required]],
      reorder: [stock && stock.reorder ? stock.reorder : 0, [Validators.nullValidator, Validators.required]],
      unit: [stock && stock.unit ? stock.unit : 'general', [Validators.nullValidator, Validators.required]],
      canExpire: [stock && stock.canExpire !== undefined ? stock.canExpire : false],
      expire: [stock && stock.expire ? stock.expire : null],
      category: [stock && stock.category ? stock.category : 'general', [Validators.required, Validators.nullValidator]],
      catalog: [stock && stock.catalog && Array.isArray(stock.catalog)
        ? stock.catalog
        : ['general'], [Validators.required, Validators.nullValidator]],
      supplier: [stock && stock.supplier ? stock.supplier : 'general', [Validators.required, Validators.nullValidator]],
      metas: stock && stock.metas
        ? this.getMetaFormGroup(stock.metas)
        : this.formBuilder.group({})
    });
  }

  private getMetaFormGroup(metas: { [p: string]: any }): FormGroup {
    const fg = this.formBuilder.group({});
    Object.keys(metas).forEach(key => {
      fg.setControl(key, this.formBuilder.control(metas[key]));
    });
    return fg;
  }

  getSaleableFormControl(): FormControl {
    return this.productForm.get('saleable') as FormControl;
  }

  getPurchasableFormControl(): FormControl {
    return this.productForm.get('purchasable') as FormControl;
  }

  getStockableFormControl(): FormControl {
    return this.productForm.get('stockable') as FormControl;
  }

  getDownloadAbleFormControl(): FormControl {
    return this.productForm.get('downloadable') as FormControl;
  }

  getDownloadsFormControl(): FormControl {
    return this.productForm.get('downloads') as FormControl;
  }

  getCanExpireFormControl(): FormControl {
    return this.productForm.get('canExpire') as FormControl;
  }

  addProduct(formElement: FormGroupDirective, inUpdateMode = false): void {
    this.productForm.markAsTouched();
    if (!this.productForm.valid) {
      this.snack.open('Fill all required fields', 'Ok', {
        duration: 3000
      });
      return;
    }

    if (this.getPurchasableFormControl().value === true
      && ((this.productForm.value.purchase >= this.productForm.value.retailPrice)
        || (this.productForm.value.purchase >= this.productForm.value.wholesalePrice))) {
      this.snack.open('Purchase price must not be greater than retailPrice/wholesalePrice', 'Ok', {
        duration: 3000
      });
      return;
    }

    if (this.productForm.get('canExpire').value && !this.productForm.get('expire').value) {
      this.snack.open('Please enter expire date', 'Ok', {
        duration: 3000
      });
      return;
    }

    this.mainProgress = true;
    if (inUpdateMode) {
      this.productForm.value.id = this.initialStock.id;
    }
    this.stockService.addStock(this.productForm.value, inUpdateMode).then(_ => {
      this.storageService.getStocks().then(value => {
        if (inUpdateMode) {
          value = value.map(value1 => {
            if (value1.id === _.id) {
              return Object.assign(value1, _);
            } else {
              return value1;
            }
          });
        } else {
          value.unshift(_ as any);
        }
        return this.storageService.saveStocks(value);
      }).catch(reason => {
      }).finally(() => {
        this.mainProgress = false;
        this.snack.open('Product added', 'Ok', {
          duration: 3000
        });
        this.productForm.reset();
        formElement.resetForm();
        this.router.navigateByUrl('/stock/products').catch(console.log);
      });
    }).catch(reason => {
      this.mainProgress = false;
      this.snack.open(reason.message ? reason.message : 'Unknown', 'Ok', {
        duration: 3000
      });
    });
  }

  updateProduct(formElement: FormGroupDirective): void {
    this.addProduct(formElement, true);
  }

  removeImage(imageInput: HTMLInputElement): void {
    imageInput.value = '';
  }

  async browserMedia($event: MouseEvent, control: string): Promise<void> {
    $event.preventDefault();
    const shop = await this.storageService.getActiveShop();
    this.dialog.open(FileBrowserDialogComponent, {
      closeOnNavigation: false,
      disableClose: true,
      data: {
        shop
      }
    }).afterClosed().subscribe(value => {
      if (value && value.url) {
        this.productForm.get(control).setValue(value.url);
      } else {
      }
    });
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {StoreModel} from '../models/store.model';
import {DeviceInfoUtil, FileBrowserDialogComponent, StorageService} from '@smartstocktz/core-libs';
import {StoreService} from '../services/store.service';
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
        <app-toolbar [heading]="isUpdateMode?'Update Item':'Store Out'"
                     [sidenav]="sidenav"
                     backLink="/store"
                     [showProgress]="false">
        </app-toolbar>
        <div class="col-11 col-xl-9 col-lg-9 col-md-10 col-sm-11 mx-auto">
          <app-store-out-component></app-store-out-component>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['../styles/create.style.scss']
})
export class StoreOutPage extends DeviceInfoUtil implements OnInit {

  @Input() isUpdateMode = false;
  @Input() initialStore: StoreModel;
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
              private readonly stockService: StoreService) {
    super();
    document.title = 'SmartStock - Store Out';
  }

  ngOnInit(): void {
    this.initializeForm(this.initialStore);
    this.metas = of([]);
  }

  initializeForm(store?: StoreModel): void {
    if (store && store.metas) {
      this.metasModel.next(Object.keys(store.metas).map<MetasModel>(x => {
        return {
          name: x,
          value: store.metas[x],
          type: typeof store.metas[x]
        };
      }));
    }
    this.productForm = this.formBuilder.group({
      image: [store && store.image ? store.image : ''],
      tag: [store && store.tag ? store.tag : '', [Validators.nullValidator, Validators.required]],
      barcode: [store && store.barcode ? store.barcode : ''],
      saleable: [store && store.saleable !== undefined ? store.saleable : true],
      downloadable: [store && store.downloadable !== undefined ? store.downloadable : false],
      downloads: [store && store.downloads ? store.downloads : []],
      stockable: [store && store.stockable !== undefined ? store.stockable : false],
      purchasable: [store && store.purchasable !== undefined ? store.purchasable : false],
      description: [store && store.description ? store.description : ''],
      purchase: [store && store.purchase ? store.purchase : 0, [Validators.nullValidator, Validators.required]],
      retailPrice: [store && store.retailPrice ? store.retailPrice : 0, [Validators.nullValidator, Validators.required]],
      wholesalePrice: [store && store.wholesalePrice ? store.wholesalePrice : 0, [Validators.nullValidator, Validators.required]],
      wholesaleQuantity: [store && store.wholesaleQuantity ? store.wholesaleQuantity : 0, [Validators.nullValidator, Validators.required]],
      quantity: [store && store.quantity ? store.quantity : 0, [Validators.nullValidator, Validators.required]],
      reorder: [store && store.reorder ? store.reorder : 0, [Validators.nullValidator, Validators.required]],
      unit: [store && store.unit ? store.unit : 'general', [Validators.nullValidator, Validators.required]],
      canExpire: [store && store.canExpire !== undefined ? store.canExpire : false],
      expire: [store && store.expire ? store.expire : null],
      category: [store && store.category ? store.category : 'general', [Validators.required, Validators.nullValidator]],
      catalog: [store && store.catalog && Array.isArray(store.catalog)
        ? store.catalog
        : ['general'], [Validators.required, Validators.nullValidator]],
      supplier: [store && store.supplier ? store.supplier : 'general', [Validators.required, Validators.nullValidator]],
      metas: store && store.metas
        ? this.getMetaFormGroup(store.metas)
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

  getStoreableFormControl(): FormControl {
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
      this.productForm.value.id = this.initialStore.id;
    }
    // this.stockService.addStore(this.productForm.value, inUpdateMode).then(_ => {
    //   this.storageService.getStores().then(value => {
    //     if (inUpdateMode) {
    //       value = value.map(value1 => {
    //         if (value1.id === _.id) {
    //           return Object.assign(value1, _);
    //         } else {
    //           return value1;
    //         }
    //       });
    //     } else {
    //       value.unshift(_ as any);
    //     }
    //     return value;
    //   }).catch(reason => {
    //   }).finally(() => {
    //     this.mainProgress = false;
    //     this.snack.open('Product added', 'Ok', {
    //       duration: 3000
    //     });
    //     this.productForm.reset();
    //     formElement.resetForm();
    //     this.router.navigateByUrl('/store').catch(console.log);
    //   });
    // }).catch(reason => {
    //   this.mainProgress = false;
    //   this.snack.open(reason.message ? reason.message : 'Unknown', 'Ok', {
    //     duration: 3000
    //   });
    // });
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

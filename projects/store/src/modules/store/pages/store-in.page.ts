import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {
  DeviceInfoUtil,
  DeviceState,
  FileBrowserDialogComponent,
  FileBrowserSheetComponent,
  FilesService,
  StorageService
} from '@smartstocktz/core-libs';
import {StoreService} from '../services/store.service';
import {MetasModel} from '../models/metas.model';
import {MatDialog} from '@angular/material/dialog';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-store-in',
  template: `
    <app-layout-sidenav
      [leftDrawerMode]="enoughWidth()?'side':'over'"
      [leftDrawerOpened]="enoughWidth()"
      [leftDrawer]="side"
      [heading]="isUpdateMode?'Update Store':'Store In'"
      backLink="/store"
      [body]="body"
      [hasBackRoute]="true">

      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>

      <ng-template #body>
        <div class="container store-new-wrapper">
          <form *ngIf="!isLoadingData" [formGroup]="productForm" #formElement="ngForm"
                (ngSubmit)="isUpdateMode?updateProduct(formElement):addProduct(formElement)">
            <div class="row d-flex justify-content-center align-items-center">

              <div style="margin-bottom: 16px" class="col-12 col-xl-9 col-lg-9 col-md-10 col-sm-11">

                <h4 style="padding: 0" class="">
                  Image
                </h4>
                <mat-card>
                  <img mat-card-image [src]="productForm.value.image" alt="Item Image">
                  <mat-card-actions>
                    <button mat-button (click)="browserMedia($event,'image')" color="primary">Upload</button>
                  </mat-card-actions>
                </mat-card>
                <mat-expansion-panel [expanded]="true" class="my-4 pt-4">

                  <mat-form-field appearance="outline" class="my-input">
                    <mat-label>Tag</mat-label>
                    <input matInput type="text" required formControlName="tag">
                    <mat-error>Tag required</mat-error>
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="my-input">
                    <mat-label>Quantity</mat-label>
                    <input min="0" matInput
                           type="number"
                           required formControlName="quantity">
                    <mat-error>Quantity required</mat-error>
                  </mat-form-field>
                  <app-category-form-field [formGroup]="productForm"></app-category-form-field>
                </mat-expansion-panel>
              </div>
              <div class="col-12 col-sm-6" style="padding-bottom: 100px">
                <div>
                  <button class="btn-block ft-button" color="primary" mat-raised-button
                          [disabled]="mainProgress">
                    {{isUpdateMode ? 'Update Item' : 'Add Item'}}
                    <mat-progress-spinner style="display: inline-block" *ngIf="mainProgress" diameter="30"
                                          mode="indeterminate"></mat-progress-spinner>
                  </button>
                  <div style="padding: 16px 0">
                    <button class="btn-block ft-button" routerLink="/store" color="primary" mat-button>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/create.style.scss']
})
export class StoreInPage extends DeviceInfoUtil implements OnInit {

  @Input() isUpdateMode = false;
  @Input() initialStore: any;
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
              private readonly filesService: FilesService,
              private readonly dialog: MatDialog,
              private readonly bottom: MatBottomSheet,
              private readonly router: Router,
              private readonly storageService: StorageService,
              private readonly deviceState: DeviceState,
              private readonly stockService: StoreService) {
    super();
    document.title = 'SmartStock - Store In';
  }

  ngOnInit(): void {
    this.initializeForm(this.initialStore);
    this.metas = of([]);
  }

  initializeForm(store?: any): void {
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
      date: [new Date(), [Validators.nullValidator, Validators.required]],
      tag: [store && store.tag ? store.tag : '', [Validators.nullValidator, Validators.required]],
      quantity: [store && store.quantity ? store.quantity : 0, [Validators.nullValidator, Validators.required]],
      category: [store && store.category ? store.category : 'general', [Validators.required, Validators.nullValidator]],
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

    this.mainProgress = true;
    if (inUpdateMode) {
      this.productForm.value.id = this.initialStore.id;
    }
    this.stockService.addStore(this.productForm.value, inUpdateMode).then(_ => {
      this.router.navigateByUrl('/store/item').catch(console.log);
      this.mainProgress = false;
      this.snack.open(this.productForm.value.tag + ' successfully stored', 'Ok', {
        duration: 3000
      });
      this.productForm.reset();
    }).catch(reason => {
      console.log(reason);
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
    const isMobile = this.deviceState.isSmallScreen.value;
    const shop = await this.storageService.getActiveShop();
    if (isMobile) {
      this.bottom.open(FileBrowserSheetComponent, {
        closeOnNavigation: false,
        disableClose: true,
        data: {
          shop
        }
      }).afterDismissed().subscribe(value => {
        if (value && value.url) {
          this.productForm.get(control).setValue(value.url);
        } else {
        }
      });
    } else {
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
}

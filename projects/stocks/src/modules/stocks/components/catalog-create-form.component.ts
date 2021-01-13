import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CatalogService} from '../services/catalog.service';
import {MatDialog} from '@angular/material/dialog';
import {FileBrowserDialogComponent, StorageService} from '@smartstocktz/core-libs';
import {CatalogModel} from '../models/catalog.model';
import {MetasModel} from '../models/metas.model';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'smartstock-stock-catalog-create-form',
  template: `
    <div style="margin-bottom: 100px; margin-top: 16px">
      <form class="d-flex flex-column" [formGroup]="newCatalogForm" (ngSubmit)="createCatalog()">

        <h2>
          Image
        </h2>
        <mat-card style="margin-bottom: 8px">
          <img alt="Catalog Image" mat-card-image [src]="newCatalogForm.value.image">
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
            <mat-label>Description</mat-label>
            <input matInput formControlName="description">
            <mat-error>Description required</mat-error>
          </mat-form-field>

          <mat-checkbox matTooltip="Select if a catalog has parents" labelPosition="after"
                        class="my-input"
                        formControlName="child">
            Is Child?
          </mat-checkbox>

          <!--          <smartstock-units-form-field [stockable]="getIsParentFormControl().value === false"-->
          <!--                                       [formGroup]="newCatalogForm">-->
          <!--          </smartstock-units-form-field>-->
          <smartstock-catalog-form-field *ngIf="getIsParentFormControl().value === true"
                                         [name]="'parents'"
                                         [label]="'Select Parents'"
                                         [onlyParent]="true"
                                         [formGroup]="newCatalogForm"></smartstock-catalog-form-field>

        </mat-card>

        <h2>
          Other Attributes
        </h2>
        <smartstock-stock-metas-form-field [formGroup]="newCatalogForm"
                                           [metas]="metasModel"></smartstock-stock-metas-form-field>

        <div style="height: 24px"></div>

        <button color="primary" [disabled]="createCatalogProgress" mat-flat-button class="ft-button">
          {{catalog ? 'Update' : 'Save'}}
          <mat-progress-spinner style="display: inline-block"
                                *ngIf="createCatalogProgress"
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
export class CatalogCreateFormComponent implements OnInit {
  newCatalogForm: FormGroup;
  createCatalogProgress = false;
  @Input() catalog: CatalogModel;
  @Input() bottomRef: MatBottomSheetRef;
  metasModel: BehaviorSubject<MetasModel[]> = new BehaviorSubject([]);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snack: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly catalogService: CatalogService) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm(): void {
    if (this.catalog && this.catalog.metas) {
      this.metasModel.next(Object.keys(this.catalog.metas).map<MetasModel>(x => {
        return {
          name: x,
          value: this.catalog.metas[x],
          type: typeof this.catalog.metas[x]
        };
      }));
    }
    this.newCatalogForm = this.formBuilder.group({
      image: [this.catalog && this.catalog.image ? this.catalog.image : ''],
      name: [this.catalog && this.catalog.name ? this.catalog.name : '', [Validators.nullValidator, Validators.required]],
      description: [this.catalog && this.catalog.description ? this.catalog.description : ''],
      child: [this.catalog && this.catalog.child ? this.catalog.child : false],
      parents: [this.catalog && this.catalog.parents ? this.catalog.parents : []],
      metas: this.catalog && this.catalog.metas
        ? this.getMetaFormGroup(this.catalog.metas)
        : this.formBuilder.group({})
    });
  }

  createCatalog(): void {
    if (!this.newCatalogForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.createCatalogProgress = true;
    this.catalogService.addCatalog(
      this.newCatalogForm.value,
      this.catalog && this.catalog.id ? this.catalog.id : null).then(_ => {
      this.createCatalogProgress = false;
      this.snack.open('Catalog Updated', 'Ok', {
        duration: 2000
      });
      if (this.bottomRef) {
        this.bottomRef.dismiss(true);
      } else {
        this.router.navigateByUrl('/stock/catalogs').catch(_2 => {
        });
      }
    }).catch(_ => {
      this.createCatalogProgress = false;
      this.snack.open(_ && _.message ? _.message : 'Catalog not updated, try again', 'Ok', {
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
        this.newCatalogForm.get('image').setValue(value.url);
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

  getIsParentFormControl(): FormControl {
    return this.newCatalogForm.get('child') as FormControl;
  }
}

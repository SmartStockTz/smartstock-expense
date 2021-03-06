import { Component, Input, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import { BehaviorSubject, Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {
  DeviceState,
  FileBrowserSheetComponent,
  FilesService,
  UserService
} from "smartstock-core";
import { ExpenseService } from "../services/expense.service";
import { MetasModel } from "../models/metas.model";
import { MatDialog } from "@angular/material/dialog";
import { MatBottomSheet } from "@angular/material/bottom-sheet";

@Component({
  selector: "app-expense-item",
  template: `
    <app-layout-sidenav
      [leftDrawerMode]="
        (deviceState.enoughWidth | async) === true ? 'side' : 'over'
      "
      [leftDrawerOpened]="(deviceState.enoughWidth | async) === true"
      [leftDrawer]="side"
      [heading]="isUpdateMode ? 'Update Item' : 'Add Item'"
      backLink="/expense"
      [body]="body"
      [hasBackRoute]="true"
    >
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>

      <ng-template #body>
        <div class="store-new-wrapper">
          <form
            *ngIf="!isLoadingData"
            [formGroup]="productForm"
            #formElement="ngForm"
            (ngSubmit)="
              isUpdateMode
                ? updateProduct(formElement)
                : addProduct(formElement)
            "
          >
            <div
              style="margin-bottom: 16px"
              class="container col-12 col-xl-8 col-lg-8 col-md-10 col-sm-11"
            >
              <mat-expansion-panel [expanded]="true" class="my-4 pt-4">
                <mat-form-field appearance="outline" class="my-input">
                  <mat-label>Name</mat-label>
                  <input matInput type="text" required formControlName="name" />
                  <mat-error>expense item name required</mat-error>
                </mat-form-field>
                <app-category-form-field
                  [formGroup]="productForm"
                ></app-category-form-field>
              </mat-expansion-panel>
              <div style="padding-bottom: 100px">
                <div>
                  <button
                    class="btn-block ft-button"
                    color="primary"
                    mat-raised-button
                    style="width: 100%"
                    [disabled]="mainProgress"
                  >
                    {{ isUpdateMode ? "Update Item" : "Add Item" }}
                    <mat-progress-spinner
                      style="display: inline-block"
                      *ngIf="mainProgress"
                      diameter="30"
                      mode="indeterminate"
                    ></mat-progress-spinner>
                  </button>
                  <div style="padding: 16px 0; width: 100%">
                    <button
                      class="btn-block ft-button"
                      routerLink="/expense"
                      color="primary"
                      mat-button
                    >
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
  styleUrls: ["../styles/create.style.scss"]
})
export class AddExpenseItemPage implements OnInit {
  @Input() isUpdateMode = false;
  @Input() initialStore: any;
  @Input() isLoadingData = false;
  metasModel: BehaviorSubject<MetasModel[]> = new BehaviorSubject([]);
  productForm: UntypedFormGroup;
  metas: Observable<
    {
      type: string;
      label: string;
      controlName: string;
    }[]
  >;
  mainProgress = false;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly snack: MatSnackBar,
    private readonly filesService: FilesService,
    private readonly dialog: MatDialog,
    private readonly bottom: MatBottomSheet,
    private readonly router: Router,
    private readonly userService: UserService,
    public readonly deviceState: DeviceState,
    private readonly stockService: ExpenseService
  ) {
    document.title = "SmartStock - Add expense item";
  }

  ngOnInit(): void {
    this.initializeForm(this.initialStore);
    this.metas = of([]);
  }

  initializeForm(store?: any): void {
    if (store && store.metas) {
      this.metasModel.next(
        Object.keys(store.metas).map<MetasModel>((x) => {
          return {
            name: x,
            value: store.metas[x],
            type: typeof store.metas[x]
          };
        })
      );
    }
    this.productForm = this.formBuilder.group({
      date: [new Date(), [Validators.nullValidator, Validators.required]],
      name: [
        store && store.tag ? store.tag : "",
        [Validators.nullValidator, Validators.required]
      ],
      category: [
        store && store.category ? store.category : "general",
        [Validators.required, Validators.nullValidator]
      ]
    });
  }

  private getMetaFormGroup(metas: { [p: string]: any }): UntypedFormGroup {
    const fg = this.formBuilder.group({});
    Object.keys(metas).forEach((key) => {
      fg.setControl(key, this.formBuilder.control(metas[key]));
    });
    return fg;
  }

  getSaleableFormControl(): UntypedFormControl {
    return this.productForm.get("saleable") as UntypedFormControl;
  }

  getPurchasableFormControl(): UntypedFormControl {
    return this.productForm.get("purchasable") as UntypedFormControl;
  }

  getStoreableFormControl(): UntypedFormControl {
    return this.productForm.get("stockable") as UntypedFormControl;
  }

  getDownloadAbleFormControl(): UntypedFormControl {
    return this.productForm.get("downloadable") as UntypedFormControl;
  }

  getDownloadsFormControl(): UntypedFormControl {
    return this.productForm.get("downloads") as UntypedFormControl;
  }

  getCanExpireFormControl(): UntypedFormControl {
    return this.productForm.get("canExpire") as UntypedFormControl;
  }

  addProduct(formElement: FormGroupDirective, inUpdateMode = false): void {
    this.productForm.markAsTouched();
    if (!this.productForm.valid) {
      this.snack.open("Fill all required fields", "Ok", {
        duration: 3000
      });
      return;
    }

    this.mainProgress = true;
    if (inUpdateMode) {
      this.productForm.value.id = this.initialStore.id;
    }
    this.stockService
      .addExpenseItem(this.productForm.value, inUpdateMode)
      .then((_) => {
        this.router.navigateByUrl("/expense/item").catch(console.log);
        this.mainProgress = false;
        this.snack.open(
          this.productForm.value.tag + " successfully stored",
          "Ok",
          {
            duration: 3000
          }
        );
        this.productForm.reset();
      })
      .catch((reason) => {
        console.log(reason);
        this.mainProgress = false;
        this.snack.open(reason.message ? reason.message : "Unknown", "Ok", {
          duration: 3000
        });
      });
  }

  updateProduct(formElement: FormGroupDirective): void {
    this.addProduct(formElement, true);
  }

  removeImage(imageInput: HTMLInputElement): void {
    imageInput.value = "";
  }

  async browserMedia($event: MouseEvent, control: string): Promise<void> {
    $event.preventDefault();
    const isMobile = this.deviceState.isSmallScreen.value;
    const shop = await this.userService.getCurrentShop();
    if (isMobile) {
      this.bottom
        .open(FileBrowserSheetComponent, {
          closeOnNavigation: false,
          disableClose: true,
          data: {
            shop
          }
        })
        .afterDismissed()
        .subscribe((value) => {
          if (value && value.url) {
            this.productForm.get(control).setValue(value.url);
          } else {
          }
        });
    } else {
      this.filesService.browse().then((value) => {
        if (value && value.url) {
          this.productForm.get(control).setValue(value.url);
        } else {
        }
      });
    }
  }
}

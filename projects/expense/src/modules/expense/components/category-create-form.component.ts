import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryService} from '../services/category.service';
import {MatDialog} from '@angular/material/dialog';
import {FilesService, UserService} from 'smartstock-core';
import {CategoryModel} from '../models/category.model';
import {MetasModel} from '../models/metas.model';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-store-category-create-form',
  template: `
    <div style="margin-bottom: 100px; margin-top: 16px">
      <form class="d-flex flex-column" [formGroup]="newCategoryForm" (ngSubmit)="createCategory()">

        <h2>
          Image
        </h2>
        <mat-card style="margin-bottom: 8px">
          <img alt="Category Image" mat-card-image [src]="newCategoryForm.value.image">
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

        </mat-card>

        <div style="height: 24px"></div>

        <button color="primary" [disabled]="createCategoryProgress" mat-flat-button class="ft-button">
          {{category ? 'Update' : 'Save'}}
          <mat-progress-spinner style="display: inline-block"
                                *ngIf="createCategoryProgress"
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
export class CategoryCreateFormComponent implements OnInit {
  newCategoryForm: UntypedFormGroup;
  createCategoryProgress = false;
  @Input() category: CategoryModel;
  @Input() bottomRef: MatBottomSheetRef;
  metasModel: BehaviorSubject<MetasModel[]> = new BehaviorSubject([]);

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly snack: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly fileService: FilesService,
    private readonly categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.initiateForm();
  }

  initiateForm(): void {
    if (this.category && this.category.metas) {
      this.metasModel.next(Object.keys(this.category.metas).map<MetasModel>(x => {
        return {
          name: x,
          value: this.category.metas[x],
          type: typeof this.category.metas[x]
        };
      }));
    }
    this.newCategoryForm = this.formBuilder.group({
      image: [this.category && this.category.image ? this.category.image : ''],
      name: [this.category && this.category.name ? this.category.name : '', [Validators.nullValidator, Validators.required]],
      description: [this.category && this.category.description ? this.category.description : ''],
      metas: this.category && this.category.metas
        ? this.getMetaFormGroup(this.category.metas)
        : this.formBuilder.group({})
    });
  }

  createCategory(): void {
    if (!this.newCategoryForm.valid) {
      this.snack.open('Please fll all details', 'Ok', {
        duration: 3000
      });
      return;
    }
    this.createCategoryProgress = true;
    this.categoryService.addCategory(
      this.newCategoryForm.value,
      this.category && this.category.id ? this.category.id : null).then(_ => {
      this.createCategoryProgress = false;
      this.snack.open('Category Updated', 'Ok', {
        duration: 2000
      });
      if (this.bottomRef) {
        this.bottomRef.dismiss(true);
      } else {
        this.router.navigateByUrl('/expense/categories').catch(_2 => {
        });
      }
    }).catch(_ => {
      this.createCategoryProgress = false;
      this.snack.open(_ && _.message ? _.message : 'Category not updated, try again', 'Ok', {
        duration: 2000
      });
    });
  }

  cancel($event: Event): void {
    $event.preventDefault();
  }

  async mediaBrowser($event: MouseEvent): Promise<void> {
    $event.preventDefault();
    this.fileService.browse().then(value => {
      if (value && value.url) {
        this.newCategoryForm.get('image').setValue(value.url);
      }
    });
  }

  private getMetaFormGroup(metas: { [p: string]: any }): UntypedFormGroup {
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

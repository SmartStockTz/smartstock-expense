import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {CategoryService} from '../services/category.service';
import {CategoryCreateFormBottomSheetComponent} from './category-create-form-bottom-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-category-form-field',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field appearance="outline" class="my-input">
        <mat-label>Category</mat-label>
        <mat-select [multiple]="false" formControlName="category">
          <mat-option *ngFor="let category of categories | async" [value]="category.name">
            {{category.name}}
          </mat-option>
        </mat-select>
        <mat-progress-spinner matTooltip="Fetching units"
                              *ngIf="categoriesFetching" matSuffix color="accent"
                              mode="indeterminate"
                              [diameter]="20"></mat-progress-spinner>
        <mat-error>Category required</mat-error>
        <div matSuffix class="d-flex flex-row">
          <button (click)="refreshCategories($event)" mat-icon-button matTooltip="refresh categories"
                  *ngIf="!categoriesFetching">
            <mat-icon>refresh</mat-icon>
          </button>
          <button (click)="addNewCategory($event)" mat-icon-button matTooltip="add new category"
                  *ngIf="!categoriesFetching">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-form-field>
    </div>
  `
})
export class CategoryFormFieldComponent implements OnInit, OnDestroy {
  @Input() formGroup: UntypedFormGroup;
  categoriesFetching = true;
  categories: Observable<any[]>;

  constructor(private readonly categoryService: CategoryService,
              private readonly bottomSheet: MatBottomSheet) {
  }

  async ngOnInit(): Promise<void> {
    this.getCategories();
  }

  getCategories(): void {
    this.categoriesFetching = true;
    this.categoryService.getAllCategory().then(categoryObject => {
      categoryObject.push({name: 'general'});
      this.categories = of(categoryObject);
      this.categoriesFetching = false;
    }).catch(reason => {
      this.categories = of([{name: 'No category'}]);
      console.warn(reason);
      this.categoriesFetching = false;
    });
  }

  addNewCategory($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.bottomSheet.open(CategoryCreateFormBottomSheetComponent, {
      data: {
        category: null
      }
    }).afterDismissed().subscribe(_ => {
      this.getCategories();
    });
  }

  refreshCategories($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.getCategories();
  }

  ngOnDestroy(): void {
  }

}

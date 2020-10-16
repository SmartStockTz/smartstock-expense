import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl} from '@angular/forms';
import {CategoryModel} from '../models/category.model';
import {StockState} from '../states/stock.state';
import {MatPaginator} from '@angular/material/paginator';
import {DialogCategoryDeleteComponent} from './dialog-category-delete.component';
import {DialogCategoryCreateComponent} from './dialog-category-create.component';

@Component({
  selector: 'smartstock-categories',
  template: `
    <mat-card class="mat-elevation-z3">
      <mat-card-title class="d-flex flex-row">
        <button (click)="openAddCategoryDialog()" color="primary" class="ft-button" mat-flat-button>
          Add Category
        </button>
        <span class="toolbar-spacer"></span>
        <button [matMenuTriggerFor]="menuCategories" mat-icon-button>
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menuCategories>
          <button (click)="getCategories()" mat-menu-item>Reload Categories</button>
        </mat-menu>
      </mat-card-title>
      <mat-card-content>
        <table style="margin-top: 16px" class="my-input"
               *ngIf="!fetchCategoriesFlag && categoriesArray && categoriesArray.length > 0"
               mat-table
               [dataSource]="categoriesDatasource">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td class="editable" [matMenuTriggerFor]="nameMenu"
                #nameMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.name}" matRipple mat-cell
                *matCellDef="let element">{{element.name}}
              <mat-menu #nameMenu>
                <ng-template matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Name</mat-label>
                      <input [value]="data" [formControl]="nameFormControl" matInput>
                    </mat-form-field>
                    <button
                      (click)="updateCategoryName({id: id, value: nameFormControl.value}, nameMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td class="editable" [matMenuTriggerFor]="descriptionMenu"
                #descriptionMenuTrigger="matMenuTrigger"
                [matMenuTriggerData]="{id: element.id, data: element.description}" matRipple mat-cell
                *matCellDef="let element">{{element.description}}
              <mat-menu #descriptionMenu>
                <ng-template style="padding: 16px" matMenuContent let-id="id" let-data="data">
                  <div (click)="$event.stopPropagation()" style="padding: 16px">
                    <mat-form-field class="my-input" appearance="outline">
                      <mat-label>Description</mat-label>
                      <textarea [value]="data" [formControl]="descriptionFormControl" matInput></textarea>
                    </mat-form-field>
                    <button
                      (click)="updateCategoryDescription({id: id, value: descriptionFormControl.value},
                     descriptionMenuTrigger)"
                      mat-button>Update
                    </button>
                  </div>
                </ng-template>
              </mat-menu>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <div class="d-flex justify-content-end align-items-end">
                Actions
              </div>
            </th>
            <td mat-cell *matCellDef="let element">
              <div class="d-flex justify-content-end align-items-end">
                <button [matMenuTriggerFor]="opts" color="primary" mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #opts>
                  <button (click)="deleteCategory(element)" mat-menu-item>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="categoriesTableColums"></tr>
          <tr mat-row class="table-data-row" *matRowDef="let row; columns: categoriesTableColums;"></tr>
        </table>
        <div *ngIf="fetchCategoriesFlag">
          <mat-progress-spinner matTooltip="fetch categories" [diameter]="30" mode="indeterminate"
                                color="primary"></mat-progress-spinner>
        </div>
        <mat-paginator #matPaginator [pageSize]="10" [pageSizeOptions]="[5,10,50]" showFirstLastButtons></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/categories.style.scss']
})
export class CategoriesComponent implements OnInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  categoriesDatasource: MatTableDataSource<CategoryModel>;
  categoriesTableColums = ['name', 'description', 'actions'];
  categoriesArray: CategoryModel[];
  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();

  constructor(private readonly stockDatabase: StockState,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit() {
    this.getCategories();
  }

  searchCategory(query: string) {
    // if ($event && $event.query) {
    //   this.fetchCategoriesFlag = true;
    //   this.stockDatabase.searchCategory($event.query, {size: 20}).then(data => {
    //     this.catalogsArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.categoriesDatasource = new MatTableDataSource(this.catalogsArray);
    //     this.fetchCategoriesFlag = false;
    //     // this.size = 0;
    //   }).catch(reason => {
    //     this.snack.open(reason, 'Ok', {
    //       duration: 3000
    //     });
    //     this.fetchCategoriesFlag = false;
    //   });
    // } else {
    //   this.getCatalogs();
    // }
  }

  getCategories() {
    this.fetchCategoriesFlag = true;
    this.stockDatabase.getAllCategory({size: 100}).then(data => {
      this.categoriesArray = JSON.parse(JSON.stringify(data));
      this.categoriesDatasource = new MatTableDataSource<CategoryModel>(this.categoriesArray);
      this.categoriesDatasource.paginator = this.matPaginator;
      this.fetchCategoriesFlag = false;
    }).catch(reason => {
      console.log(reason);
      this.fetchCategoriesFlag = false;
    });
  }

  deleteCategory(element: any) {
    this.dialog.open(DialogCategoryDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.categoriesArray = this.categoriesArray.filter(value => value.id !== element.id);
        this.categoriesDatasource = new MatTableDataSource<CategoryModel>(this.categoriesArray);
        this.snack.open('Category deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('Category not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateCategoryName(category, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (category && category.value) {
      category.field = 'name';
      this.updateCategory(category);
    }
  }

  updateCategory(category: { id: string, value: string, field: string }) {
    this.snack.open('Update in progress..', 'Ok');
    this.stockDatabase.updateCategory(category).then(data => {
      const editedObjectIndex = this.categoriesArray.findIndex(value => value.id === data.id);
      this.categoriesArray = this.categoriesArray.filter(value => value.id !== category.id);
      if (editedObjectIndex !== -1) {
        const updatedObject = this.categoriesArray[editedObjectIndex];
        updatedObject[category.field] = category.value;
        this.categoriesDatasource.data[editedObjectIndex] = updatedObject;
      } else {
        console.warn('fails to update category table');
      }
      this.snack.open('Category updated', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      this.snack.open(reason && reason.message ? reason.message : 'Fail to update category', 'Ok', {
        duration: 3000
      });
    });
  }

  updateCategoryDescription(category, matMenu: MatMenuTrigger) {
    matMenu.toggleMenu();
    if (category && category.value) {
      category.field = 'description';
      this.updateCategory(category);
    }
  }

  openAddCategoryDialog() {
    this.dialog.open(DialogCategoryCreateComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.categoriesArray.push(value);
        this.categoriesDatasource.data = this.categoriesArray;
      }
    });
  }
}


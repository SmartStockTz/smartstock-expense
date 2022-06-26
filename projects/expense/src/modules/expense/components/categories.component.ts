import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { UntypedFormBuilder } from "@angular/forms";
import { CategoryModel } from "../models/category.model";
import { MatPaginator } from "@angular/material/paginator";
import { DialogCategoryDeleteComponent } from "./dialog-category-delete.component";
import { CategoryService } from "../services/category.service";
import { Router } from "@angular/router";
import { CategoryState } from "../states/category.state";
import { UserService } from "smartstock-core";

@Component({
  selector: "app-categories",
  template: `
    <mat-card-title class="d-flex flex-row">
      <button
        routerLink="/expense/categories/create"
        color="primary"
        class="ft-button"
        mat-flat-button
      >
        Add Category
      </button>
      <span class="toolbar-spacer"></span>
      <button [matMenuTriggerFor]="menuCategories" mat-icon-button>
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menuCategories>
        <button (click)="reload()" mat-menu-item>Reload Categories</button>
      </mat-menu>
    </mat-card-title>
    <mat-card class="mat-elevation-z3">
      <mat-card-content>
        <table
          style="margin-top: 16px"
          class="my-input"
          *ngIf="
            !fetchCategoriesFlag &&
            categoriesArray &&
            categoriesArray.length > 0
          "
          mat-table
          [dataSource]="categoriesDatasource"
        >
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td class="editable" matRipple mat-cell *matCellDef="let element">
              {{ element.name }}
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td class="editable" matRipple mat-cell *matCellDef="let element">
              {{ element.description }}
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
                <button
                  [matMenuTriggerFor]="opts"
                  color="primary"
                  mat-icon-button
                >
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #opts>
                  <button (click)="editCategory(element)" mat-menu-item>
                    Edit
                  </button>
                  <button (click)="deleteCategory(element)" mat-menu-item>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="categoriesTableColums"></tr>
          <tr
            mat-row
            class="table-data-row"
            *matRowDef="let row; columns: categoriesTableColums"
          ></tr>
        </table>
        <div *ngIf="fetchCategoriesFlag">
          <mat-progress-spinner
            matTooltip="fetch categories"
            [diameter]="30"
            mode="indeterminate"
            color="primary"
          ></mat-progress-spinner>
        </div>
        <mat-paginator
          #matPaginator
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 50]"
          showFirstLastButtons
        ></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ["../styles/categories.style.scss"]
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @ViewChild("matPaginator") matPaginator: MatPaginator;
  categoriesDatasource: MatTableDataSource<
    CategoryModel
  > = new MatTableDataSource<CategoryModel>([]);
  categoriesTableColums = ["name", "description", "actions"];
  categoriesArray: CategoryModel[] = [];
  fetchCategoriesFlag = false;

  constructor(
    private readonly stockDatabase: CategoryService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly dialog: MatDialog,
    private readonly categoryState: CategoryState,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly snack: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.getCategories();
  }

  ngOnDestroy(): void {}

  getCategories(): void {
    this.fetchCategoriesFlag = true;
    this.stockDatabase
      .getAllCategory()
      .then((data) => {
        this.categoriesArray = JSON.parse(JSON.stringify(data));
        this.categoriesDatasource = new MatTableDataSource<CategoryModel>(
          this.categoriesArray
        );
        this.categoriesDatasource.paginator = this.matPaginator;
        this.fetchCategoriesFlag = false;
      })
      .catch((reason) => {
        console.log(reason);
        this.fetchCategoriesFlag = false;
      });
  }

  editCategory(element: CategoryModel): void {
    this.categoryState.selectedForEdit.next(element);
    this.router
      .navigateByUrl("/expense/categories/edit/" + element.id)
      .catch((_) => {});
  }

  deleteCategory(element: any): void {
    this.dialog
      .open(DialogCategoryDeleteComponent, {
        data: element,
        disableClose: true
      })
      .afterClosed()
      .subscribe((_) => {
        if (_) {
          this.categoriesArray = this.categoriesArray.filter(
            (value) => value.id !== element.id
          );
          this.categoriesDatasource = new MatTableDataSource<CategoryModel>(
            this.categoriesArray
          );
          this.snack.open("Category deleted", "Ok", {
            duration: 2000
          });
        } else {
          this.snack.open("Category not deleted", "Ok", {
            duration: 2000
          });
        }
      });
  }

  updateCategory(category: { id: string; value: string; field: string }): void {
    this.snack.open("Update in progress..", "Ok");
    this.stockDatabase
      .updateCategory(category)
      .then((data) => {
        const editedObjectIndex = this.categoriesArray.findIndex(
          (value) => value.id === data.id
        );
        this.categoriesArray = this.categoriesArray.filter(
          (value) => value.id !== category.id
        );
        if (editedObjectIndex !== -1) {
          const updatedObject = this.categoriesArray[editedObjectIndex];
          updatedObject[category.field] = category.value;
          this.categoriesDatasource.data[editedObjectIndex] = updatedObject;
        } else {
          console.warn("fails to update category table");
        }
        this.snack.open("Category updated", "Ok", {
          duration: 3000
        });
      })
      .catch((reason) => {
        this.snack.open(
          reason && reason.message ? reason.message : "Fail to update category",
          "Ok",
          {
            duration: 3000
          }
        );
      });
  }

  reload(): void {
    this.fetchCategoriesFlag = true;
    this.stockDatabase
      .getAllCategoryRemote()
      .then((data) => {
        this.categoriesArray = JSON.parse(JSON.stringify(data));
        this.categoriesDatasource = new MatTableDataSource<CategoryModel>(
          this.categoriesArray
        );
        this.categoriesDatasource.paginator = this.matPaginator;
        this.fetchCategoriesFlag = false;
      })
      .catch((reason) => {
        console.log(reason);
        this.fetchCategoriesFlag = false;
      });
  }
}

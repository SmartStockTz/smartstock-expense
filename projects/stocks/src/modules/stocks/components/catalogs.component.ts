import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {DialogCatalogDeleteComponent} from './dialog-catalog-delete.component';
import {CatalogModel} from '../models/catalog.model';
import {DialogCatalogCreateComponent} from './dialog-catalog-create.component';
import {CatalogService} from '../services/catalog.service';
import {CatalogState} from '../states/catalog.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-catalogs',
  template: `
    <mat-card-title class="d-flex flex-row">
      <button routerLink="/stock/catalogs/create" color="primary" class="ft-button" mat-flat-button>
        Add Catalog
      </button>
      <span class="toolbar-spacer"></span>
      <button [matMenuTriggerFor]="menuCategories" mat-icon-button>
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menuCategories>
        <button (click)="getCatalogs()" mat-menu-item>Reload Catalogs</button>
      </mat-menu>
    </mat-card-title>
    <mat-card class="mat-elevation-z3">
      <mat-card-content>
        <table style="margin-top: 16px" class="my-input"
               *ngIf="!fetchCategoriesFlag && catalogsArray && catalogsArray.length > 0"
               mat-table
               [dataSource]="catalogsDatasource">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td class="editable" matRipple mat-cell
                *matCellDef="let element">{{element.name}}
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td class="editable" matRipple mat-cell
                *matCellDef="let element">
              {{element.description}}
            </td>
          </ng-container>

          <ng-container matColumnDef="parents">
            <th mat-header-cell *matHeaderCellDef>Parents</th>
            <td class="editable" mat-cell *matCellDef="let element">
              {{element.parents.length}}
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
                  <button (click)="editCatalog(element)" mat-menu-item>
                    Edit
                  </button>
                  <button (click)="deleteCatalog(element)" mat-menu-item>
                    Delete
                  </button>
                </mat-menu>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="catalogsTableColums"></tr>
          <tr mat-row class="table-data-row" *matRowDef="let row; columns: catalogsTableColums;"></tr>
        </table>
        <div *ngIf="fetchCategoriesFlag">
          <mat-progress-spinner matTooltip="fetch catalogs" [diameter]="30" mode="indeterminate"
                                color="primary"></mat-progress-spinner>
        </div>
        <mat-paginator #matPaginator [pageSize]="10" [pageSizeOptions]="[5,10,50]" showFirstLastButtons></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/catalogs.style.scss']
})
export class CatalogsComponent implements OnInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  catalogsDatasource: MatTableDataSource<CatalogModel> = new MatTableDataSource<CatalogModel>([]);
  catalogsTableColums = ['name', 'description', 'parents', 'actions'];
  catalogsArray: CatalogModel[] = [];
  fetchCategoriesFlag = false;
  nameFormControl = new FormControl();
  descriptionFormControl = new FormControl();

  constructor(private readonly catalogService: CatalogService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly catalogState: CatalogState,
              private readonly router: Router,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getCatalogs();
  }

  searchCatalog(query: string): void {
    // if ($event && $event.query) {
    //   this.fetchCategoriesFlag = true;
    //   this.stockDatabase.searchCatalog($event.query, {size: 20}).then(data => {
    //     this.catalogsArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.catalogsDatasource = new MatTableDataSource(this.catalogsArray);
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

  getCatalogs(): void {
    this.fetchCategoriesFlag = true;
    this.catalogService.getAllCatalogs({size: 100}).then(data => {
      this.catalogsArray = data;
      this.catalogsDatasource = new MatTableDataSource<CatalogModel>(this.catalogsArray);
      this.catalogsDatasource.paginator = this.matPaginator;
      this.fetchCategoriesFlag = false;
    }).catch(_ => {
      this.fetchCategoriesFlag = false;
    });
  }

  deleteCatalog(element: any): void {
    this.dialog.open(DialogCatalogDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.catalogsArray = this.catalogsArray.filter(value => value.id !== element.id);
        this.catalogsDatasource = new MatTableDataSource<CatalogModel>(this.catalogsArray);
        this.snack.open('Catalog deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('Catalog not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  updateCatalogName(catalog, matMenu: MatMenuTrigger): void {
    matMenu.toggleMenu();
    if (catalog && catalog.value) {
      catalog.field = 'name';
      this.updateCatalog(catalog);
    }
  }

  updateCatalog(catalog: { id: string, value: string, field: string }): void {
    this.snack.open('Update in progress..', 'Ok');
    this.catalogService.updateCatalog(catalog).then(data => {
      const editedObjectIndex = this.catalogsArray.findIndex(value => value.id === data.id);
      this.catalogsArray = this.catalogsArray.filter(value => value.id !== catalog.id);
      if (editedObjectIndex !== -1) {
        const updatedObject = this.catalogsArray[editedObjectIndex];
        updatedObject[catalog.field] = catalog.value;
        this.catalogsDatasource.data[editedObjectIndex] = updatedObject;
      } else {
        console.warn('fails to update catalog table');
      }
      this.snack.open('Catalog updated', 'Ok', {
        duration: 3000
      });
    }).catch(reason => {
      this.snack.open(reason && reason.message ? reason.message : 'Fail to update catalog', 'Ok', {
        duration: 3000
      });
    }).finally(() => {
      this.descriptionFormControl.setValue(null);
      this.nameFormControl.setValue(null);
    });
  }

  updateCatalogDescription(catalog, matMenu: MatMenuTrigger): void {
    matMenu.toggleMenu();
    if (catalog && catalog.value) {
      catalog.field = 'description';
      this.updateCatalog(catalog);
    }
  }

  openAddCatalogDialog(): void {
    this.dialog.open(DialogCatalogCreateComponent, {
      closeOnNavigation: true,
      hasBackdrop: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.catalogsArray.push(value);
        this.catalogsDatasource.data = this.catalogsArray;
      }
    });
  }

  editCatalog(element: CatalogModel): void {
    this.catalogState.selectedForEdit.next(element);
    this.router.navigateByUrl('/stock/catalogs/edit/' + element.id).catch(_ => {
    });
  }
}


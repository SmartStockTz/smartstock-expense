import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder} from '@angular/forms';
import {SupplierModel} from '../models/supplier.model';
import {MatPaginator} from '@angular/material/paginator';
import {SupplierService} from '../services/supplier.service';
import {SupplierState} from '../states/supplier.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-suppliers',
  template: `
    <mat-card-title class="d-flex flex-row">
      <button routerLink="/stock/suppliers/create" color="primary" class="ft-button" mat-flat-button>
        Add Supplier
      </button>
      <span class="toolbar-spacer"></span>
      <button [matMenuTriggerFor]="menuSuppliers" mat-icon-button>
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menuSuppliers>
        <button (click)="getSuppliers()" mat-menu-item>Reload Suppliers</button>
      </mat-menu>
    </mat-card-title>
    <mat-card class="mat-elevation-z3">
      <mat-card-content>
        <table style="margin-top: 16px" class="my-input"
               *ngIf="!fetchSuppliersFlag && suppliersArray && suppliersArray.length > 0"
               mat-table
               [dataSource]="suppliersDatasource">

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">
              {{element.name}}
            </td>
          </ng-container>

          <ng-container matColumnDef="mobile">
            <th mat-header-cell *matHeaderCellDef>Mobile</th>
            <td mat-cell *matCellDef="let element">
              {{element.number}}
            </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell
                *matCellDef="let element">
              {{element.email}}
            </td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>Address</th>
            <td mat-cell
                *matCellDef="let element">
              {{element.address}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>
              <!--          <div class="d-flex justify-content-end align-items-end">-->
              <!--            Actions-->
              <!--          </div>-->
            </th>
            <td mat-cell *matCellDef="let element">
              <div class="d-flex justify-content-end align-items-end">
                <button color="primary" mat-icon-button>
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="suppliersTableColums"></tr>
          <tr mat-row [matMenuTriggerFor]="opts" class="table-data-row"
              *matRowDef="let element; columns: suppliersTableColums;">
            <div style="display: flex;">
              <div style="flex-grow: 1"></div>
              <mat-menu #opts [xPosition]="'after'">
                <!--                  <button (click)="viewSupplier(element)" mat-menu-item>-->
                <!--                    View-->
                <!--                  </button>-->
                <button (click)="editSupplier(element)" mat-menu-item>
                  Edit
                </button>
                <button (click)="deleteSupplier(element)" mat-menu-item>
                  Delete
                </button>
              </mat-menu>
            </div>
          </tr>

        </table>
        <div *ngIf="fetchSuppliersFlag">
          <mat-progress-spinner matTooltip="fetch suppliers"
                                [diameter]="30" mode="indeterminate"
                                color="primary">
          </mat-progress-spinner>
        </div>
        <mat-paginator #matPaginator [pageSize]="10" [pageSizeOptions]="[5,10,50]" showFirstLastButtons></mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['../styles/suppliers.style.scss']
})
export class SuppliersComponent implements OnInit {
  @ViewChild('matPaginator') matPaginator: MatPaginator;
  suppliersDatasource: MatTableDataSource<SupplierModel> = new MatTableDataSource<SupplierModel>([]);
  suppliersTableColums = ['name', 'email', 'mobile', 'address', 'actions'];
  suppliersArray: SupplierModel[] = [];
  fetchSuppliersFlag = false;

  constructor(private readonly supplierService: SupplierService,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly router: Router,
              private readonly supplierState: SupplierState,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getSuppliers();
  }

  searchSupplier(query: string): void {
    // if ($event && $event.query) {
    //   this.fetchSuppliersFlag = true;
    //   this.stockDatabase.searchSupplier($event.query, {size: 20}).then(data => {
    //     this.suppliersArray = JSON.parse(JSON.stringify(data));
    //     // this.skip +=this.productsArray.length;
    //     this.suppliersDatasource = new MatTableDataSource(this.suppliersArray);
    //     this.fetchSuppliersFlag = false;
    //     // this.size = 0;
    //   }).catch(reason => {
    //     this.snack.open(reason, 'Ok', {
    //       duration: 3000
    //     });
    //     this.fetchSuppliersFlag = false;
    //   });
    // } else {
    //   this.getSuppliers();
    // }
  }

  getSuppliers(): void {
    this.fetchSuppliersFlag = true;
    this.supplierService.getAllSupplier({size: 100}).then(data => {
      this.suppliersArray = JSON.parse(JSON.stringify(data));
      this.suppliersDatasource = new MatTableDataSource<SupplierModel>(this.suppliersArray);
      this.suppliersDatasource.paginator = this.matPaginator;
      this.fetchSuppliersFlag = false;
    }).catch(_ => {
      this.fetchSuppliersFlag = false;
    });
  }

  deleteSupplier(element: any): void {
    this.dialog.open(DialogSupplierDeleteComponent, {
      data: element,
      disableClose: true
    }).afterClosed().subscribe(_ => {
      if (_) {
        this.suppliersArray = this.suppliersArray.filter(value => value.id !== element.id);
        this.suppliersDatasource = new MatTableDataSource<SupplierModel>(this.suppliersArray);
        this.snack.open('Supplier deleted', 'Ok', {
          duration: 2000
        });
      } else {
        this.snack.open('Supplier not deleted', 'Ok', {
          duration: 2000
        });
      }
    });
  }

  editSupplier(element: SupplierModel): void {
    this.supplierState.selectedForEdit.next(element);
    this.router.navigateByUrl('/stock/suppliers/edit/' + element.id).catch(_ => {
    });
  }
}

@Component({
  selector: 'app-dialog-delete',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete : <b>{{' ' + data.name}}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button [disabled]="deleteProgress" color="primary" mat-button (click)="deleteSupplier(data)">
            Delete
            <mat-progress-spinner *ngIf="deleteProgress"
                                  matTooltip="Delete in progress..."
                                  style="display: inline-block" mode="indeterminate" diameter="15"
                                  color="accent"></mat-progress-spinner>
          </button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button mat-dialog-close [disabled]="deleteProgress" color="primary" mat-button (click)="cancel()">Cancel
          </button>
        </div>
      </div>
      <p class="bg-danger" *ngIf="errorSupplierMessage">{{errorSupplierMessage}}</p>
    </div>
  `
})
export class DialogSupplierDeleteComponent {
  deleteProgress = false;
  errorSupplierMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DialogSupplierDeleteComponent>,
    private readonly supplierService: SupplierService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deleteSupplier(supplier: SupplierModel): void {
    this.errorSupplierMessage = undefined;
    this.deleteProgress = true;
    this.supplierService.deleteSupplier(supplier.id).then(value => {
      this.dialogRef.close(supplier);
      this.deleteProgress = false;
    }).catch(reason => {
      this.errorSupplierMessage = 'Fails to delete supplier, try again';
      this.deleteProgress = false;
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}

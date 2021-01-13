// import {Component, Input, OnInit} from '@angular/core';
// import {FormGroup} from '@angular/forms';
// import {Observable, of} from 'rxjs';
// import {MatDialog} from '@angular/material/dialog';
// import {CatalogService} from "../services/catalog.service";
// import {DialogCatalogCreateComponent} from "./dialog-catalog-create.component";
//
// @Component({
//   selector: 'smartstock-catalogs-form-field',
//   template: `
//     <div [formGroup]="formGroup" *ngIf="parent">
//       <mat-form-field appearance="outline" class="my-input">
//         <mat-label>Catalog</mat-label>
//         <mat-select formControlName="catalog">
//           <mat-option *ngFor="let catalog of catalogs | async" [value]="catalog.name">
//             {{catalog.name}}
//           </mat-option>
//         </mat-select>
//         <mat-progress-spinner matTooltip="Fetching catalogs"
//                               *ngIf="catalogsFetching" matSuffix color="accent"
//                               mode="indeterminate"
//                               [diameter]="20"></mat-progress-spinner>
//         <mat-error>Catalog required</mat-error>
//         <div matSuffix class="d-flex flex-row">
//           <button (click)="refreshCatalogs($event)" mat-icon-button matTooltip="refresh catalogs"
//                   *ngIf="!catalogsFetching">
//             <mat-icon>refresh</mat-icon>
//           </button>
//           <button (click)="addNewCatalog($event)" mat-icon-button matTooltip="add new catalog"
//                   *ngIf="!catalogsFetching">
//             <mat-icon>add</mat-icon>
//           </button>
//         </div>
//       </mat-form-field>
//     </div>
//   `
// })
// export class CatalogsFormFieldComponent implements OnInit {
//   @Input() formGroup: FormGroup;
//   catalogs: Observable<[any]>;
//   catalogsFetching = true;
//   @Input() parent = false;
//
//   constructor(private readonly catalogsService: CatalogService,
//               private readonly dialog: MatDialog) {
//   }
//
//   ngOnInit(): void {
//     this.getCatalogs();
//   }
//
//   getCatalogs(): void {
//     this.catalogsFetching = true;
//     this.catalogsService.getAllCatalog({}).then(catalogsObjects => {
//       this.catalogs = of(JSON.parse(JSON.stringify(catalogsObjects)));
//       this.catalogsFetching = false;
//     }).catch(reason => {
//       this.catalogs = of([{name: 'No catalog'}]);
//       console.warn(reason);
//       this.catalogsFetching = false;
//     });
//   }
//
//   addNewCatalog($event: MouseEvent): void {
//     $event.preventDefault();
//     $event.stopPropagation();
//     this.dialog.open(DialogCatalogCreateComponent, {
//       closeOnNavigation: true
//     }).afterClosed().subscribe(value => {
//       if (value) {
//         this.getCatalogs();
//       }
//     });
//   }
//
//   refreshCatalogs($event: MouseEvent): void {
//     $event.preventDefault();
//     $event.stopPropagation();
//     this.getCatalogs();
//   }
//
// }

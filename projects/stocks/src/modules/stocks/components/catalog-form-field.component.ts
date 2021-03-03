import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogCatalogCreateComponent} from './dialog-catalog-create.component';
import {CatalogService} from '../services/catalog.service';

@Component({
  selector: 'app-catalog-form-field',
  template: `
    <div [formGroup]="formGroup">
      <mat-form-field appearance="outline" class="my-input">
        <mat-label>{{label}}</mat-label>
        <mat-select [multiple]="true" formControlName="{{name}}" >
          <mat-option *ngFor="let catalog of catalogs | async" [value]="catalog">
            {{catalog.name}}
          </mat-option>
        </mat-select>
        <mat-progress-spinner matTooltip="Fetching catalogs"
                              *ngIf="catalogsFetching" matSuffix color="accent"
                              mode="indeterminate"
                              [diameter]="20"></mat-progress-spinner>
        <mat-error>Catalog required</mat-error>
        <div matSuffix class="d-flex flex-row">
          <button (click)="refreshCategories($event)" mat-icon-button matTooltip="Refresh catalogs"
                  *ngIf="!catalogsFetching">
            <mat-icon>refresh</mat-icon>
          </button>
          <button (click)="addNewCatalog($event)" mat-icon-button matTooltip="Add new catalog"
                  *ngIf="!catalogsFetching">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-form-field>
    </div>
  `
})
export class CatalogFormFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;
  catalogsFetching = true;
  catalogs: Observable<any[]>;
  @Input() name = 'catalog';
  @Input() label = 'Catalogs';
  @Input() onlyParent = false;

  constructor(private readonly catalogService: CatalogService,
              private readonly dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getCatalogs();
  }

  getCatalogs(): void {
    this.catalogsFetching = true;
    this.catalogService.getAllCatalogs({size: 10000}).then(catalogObject => {
      if (this.onlyParent === true) {
        catalogObject = catalogObject.filter(x => {
          return x.child === false;
        });
      }
      catalogObject.push({name: 'general'});
      this.catalogs = of(catalogObject);
      this.catalogsFetching = false;
    }).catch(_ => {
      this.catalogs = of([{name: 'general'}]);
      this.catalogsFetching = false;
    });
  }

  addNewCatalog($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(DialogCatalogCreateComponent, {
      closeOnNavigation: true
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getCatalogs();
      }
    });
  }

  refreshCategories($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.getCatalogs();
  }

}

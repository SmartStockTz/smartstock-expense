import {NgModule} from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {RouterModule, ROUTES, Routes} from '@angular/router';
import {DialogDeleteComponent, StoreDetailsComponent} from './components/store.component';
import {EditPageComponent} from './pages/edit.page';
import {CategoriesComponent} from './components/categories.component';
import {DialogUnitDeleteComponent, DialogUnitNewComponent, UnitsComponent} from './components/units.component';
import {ImportsDialogComponent} from './components/imports.component';
import {CommonModule} from '@angular/common';
import {ConfigsService, LibModule} from '@smartstocktz/core-libs';
import {CategoryFormFieldComponent} from './components/category-form-field.component';
import {UnitsFormFieldComponent} from './components/units-form-field.component';
import {ProductShortDetailFormComponent} from './components/product-short-detail-form.component';
import {IndexPage} from './pages/index.page';
import {CategoriesPage} from './pages/categories.page';
import {DialogCategoryDeleteComponent} from './components/dialog-category-delete.component';
import {DialogCategoryCreateComponent} from './components/dialog-category-create.component';
import {TotalProductsSummaryComponent} from './components/total-products-summary.component';
import {ProductsValueSummaryComponent} from './components/products-value-summary.component';
import {MatSortModule} from '@angular/material/sort';
import {CdkTableModule} from '@angular/cdk/table';
import {ProductsTableComponent} from './components/products-table.component';
import {ProductsTableActionsComponent} from './components/products-table-actions.component';
import {ProductsTableSubActionsComponent} from './components/products-table-sub-actions.component';
import {TransfersTableComponent} from './components/transfers-table.component';
import {TransfersTableActionsComponent} from './components/transfers-table-actions.component';
import {TransferCreateFormComponent} from './components/transfer-create-form.component';
import {ProductSearchDialogComponent} from './components/product-search-dialog.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {InfoDialogComponent} from './components/info-dialog.component';
import {TransfersItemsViewComponent} from './components/transfers-items-view.component';
import {TransfersExportOptionsComponent} from './components/transfers-export-options.component';
import {DownloadableComponent} from './components/downloadable.component';
import {MetasFormFieldComponent} from './components/metas-form-field.component';
import {GeneratedFormFieldComponent} from './components/generated-form-field.component';
import {CategoryCreatePage} from './pages/category-create.page';
import {CategoryCreateFormComponent} from './components/category-create-form.component';
import {CategoriesEditPage} from './pages/categories-edit.page';
import {CategoryCreateFormBottomSheetComponent} from './components/category-create-form-bottom-sheet.component';
import {StorePage} from './pages/store.page';
import {StoreInPage} from './pages/store-in.page';
import {StoreOutPage} from './pages/store-out.page';
import {AnimateDigitComponent} from './components/animate-digit.component';
import {StoreOutComponent} from './components/store-out.component';
import {StoreOutSearchComponent} from './components/store-out-search.component';
import {StoreReportComponent} from './components/store-report.component';
import {StoreReportPage} from './pages/store-report.page';
import {StoreOutDetailsComponent} from './components/store-out-details.component';
import {StoreReportByCategoryComponent} from './components/store-report-by-category.component';
import {StoreReportByTagComponent} from './components/store-report-by-tag.component';

const routes: Routes = [
  {path: '', component: IndexPage},
  {path: 'item', component: StorePage},
  {path: 'item/in', component: StoreInPage},
  {path: 'item/in/:id', component: EditPageComponent},
  {path: 'item/out', component: StoreOutPage},
  {path: 'report', component: StoreReportPage},
  {path: 'categories', component: CategoriesPage},
  {path: 'categories/create', component: CategoryCreatePage},
  {path: 'categories/edit/:id', component: CategoriesEditPage},
];

@NgModule({
  imports: [
    CommonModule,
    {
      ngModule: RouterModule,
      providers: [
        {
          provide: ROUTES,
          multi: true,
          useValue: routes
        }
      ]
    },
    LibModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatRippleModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatDialogModule,
    MatListModule,
    MatSortModule,
    CdkTableModule,
    ScrollingModule,
    FormsModule
  ],
  declarations: [
    CategoriesEditPage,
    CategoryCreateFormBottomSheetComponent,
    CategoryCreatePage,
    MetasFormFieldComponent,
    GeneratedFormFieldComponent,
    DownloadableComponent,
    TransfersItemsViewComponent,
    TransfersExportOptionsComponent,
    InfoDialogComponent,
    TransferCreateFormComponent,
    TransfersTableComponent,
    TransfersTableActionsComponent,
    ProductsTableActionsComponent,
    ProductsTableComponent,
    DialogDeleteComponent,
    IndexPage,
    EditPageComponent,
    CategoriesComponent,
    UnitsComponent,
    StoreDetailsComponent,
    DialogCategoryDeleteComponent,
    DialogCategoryCreateComponent,
    DialogUnitDeleteComponent,
    DialogUnitNewComponent,
    ImportsDialogComponent,
    CategoryFormFieldComponent,
    UnitsFormFieldComponent,
    ProductShortDetailFormComponent,
    ProductShortDetailFormComponent,
    CategoriesPage,
    TotalProductsSummaryComponent,
    ProductsValueSummaryComponent,
    ProductsTableSubActionsComponent,
    ProductSearchDialogComponent,
    CategoryCreateFormComponent,
    StorePage,
    StoreInPage,
    StoreOutPage,
    AnimateDigitComponent,
    StoreOutComponent,
    StoreOutSearchComponent,
    StoreReportComponent,
    StoreReportPage,
    StoreOutDetailsComponent,
    StoreReportByCategoryComponent,
    StoreReportByTagComponent
  ],
  entryComponents: []
})
export class StoreModule {
  constructor(private readonly configs: ConfigsService) {
    this.configs.addMenu({
      name: 'Store',
      link: '/store',
      icon: 'store',
      roles: ['admin', 'manager'],
      pages: [
        {
          name: 'items',
          link: '/store/item',
          roles: ['admin', 'manager']
        },
        {
          name: 'store in',
          link: '/store/item/in',
          roles: ['admin', 'manager']
        },
        {
          name: 'store out',
          link: '/store/item/out',
          roles: ['admin', 'manager']
        },
        {
          name: 'categories',
          link: '/store/categories',
          roles: ['admin', 'manager']
        },
        {
          name: 'report',
          link: '/store/report',
          roles: ['admin', 'manager']
        }
      ]
    });
    this.configs.selectedModuleName = 'Store';
  }
}

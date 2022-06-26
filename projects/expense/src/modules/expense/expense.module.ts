import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { RouterModule, ROUTES, Routes } from "@angular/router";
import {
  DialogDeleteComponent,
  StoreDetailsComponent
} from "./components/expense.component";
import { EditPageComponent } from "./pages/edit.page";
import { CategoriesComponent } from "./components/categories.component";
import { CommonModule } from "@angular/common";
import { LibModule } from "smartstock-core";
import { CategoryFormFieldComponent } from "./components/category-form-field.component";
import { ProductShortDetailFormComponent } from "./components/product-short-detail-form.component";
import { IndexPage } from "./pages/index.page";
import { CategoriesPage } from "./pages/categories.page";
import { DialogCategoryDeleteComponent } from "./components/dialog-category-delete.component";
import { DialogCategoryCreateComponent } from "./components/dialog-category-create.component";
import { ProductsValueSummaryComponent } from "./components/products-value-summary.component";
import { MatSortModule } from "@angular/material/sort";
import { CdkTableModule } from "@angular/cdk/table";
import { ProductsTableComponent } from "./components/products-table.component";
import { ProductsTableActionsComponent } from "./components/products-table-actions.component";
import { ProductsTableSubActionsComponent } from "./components/products-table-sub-actions.component";
import { ItemSearchDialogComponent } from "./components/item-search-dialog.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { InfoDialogComponent } from "./components/info-dialog.component";
import { MetasFormFieldComponent } from "./components/metas-form-field.component";
import { GeneratedFormFieldComponent } from "./components/generated-form-field.component";
import { CategoryCreatePage } from "./pages/category-create.page";
import { CategoryCreateFormComponent } from "./components/category-create-form.component";
import { CategoriesEditPage } from "./pages/categories-edit.page";
import { CategoryCreateFormBottomSheetComponent } from "./components/category-create-form-bottom-sheet.component";
import { ExpenseItemsPage } from "./pages/expense-items.page";
import { AddExpenseItemPage } from "./pages/add-expense-item.page";
import { AddExpensePage } from "./pages/add-expense.page";
import { AddExpensesComponent } from "./components/add-expenses.component";
import { AddExpenseSearchDialogComponent } from "./components/add-expense-search-dialog.component";
import { ExpensesReportComponent } from "./components/expenses-report.component";
import { ExpenseReportPage } from "./pages/expense-report.page";
import { ExpenseReportDetailsComponent } from "./components/expense-report-details.component";
import { ExpensesReportByCategoryComponent } from "./components/expenses-report-by-category.component";
import { ExpensesReportByNameComponent } from "./components/expenses-report-by-name.component";
import { AddExpenseSearchBottomSheetComponent } from "./components/add-expense-search-bottom-sheet.component";
import { ExpenseNavigationService } from "./services/expense-navigation.service";

const routes: Routes = [
  { path: "", component: IndexPage },
  { path: "item", component: ExpenseItemsPage },
  { path: "item/in", component: AddExpenseItemPage },
  { path: "item/in/:id", component: EditPageComponent },
  { path: "item/out", component: AddExpensePage },
  { path: "report", component: ExpenseReportPage },
  { path: "categories", component: CategoriesPage },
  { path: "categories/create", component: CategoryCreatePage },
  { path: "categories/edit/:id", component: CategoriesEditPage }
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
        FormsModule,
        MatBottomSheetModule,
        MatMenuModule
    ],
    declarations: [
        CategoriesEditPage,
        CategoryCreateFormBottomSheetComponent,
        CategoryCreatePage,
        MetasFormFieldComponent,
        GeneratedFormFieldComponent,
        InfoDialogComponent,
        ProductsTableActionsComponent,
        ProductsTableComponent,
        DialogDeleteComponent,
        IndexPage,
        EditPageComponent,
        CategoriesComponent,
        StoreDetailsComponent,
        DialogCategoryDeleteComponent,
        DialogCategoryCreateComponent,
        CategoryFormFieldComponent,
        ProductShortDetailFormComponent,
        ProductShortDetailFormComponent,
        CategoriesPage,
        ProductsValueSummaryComponent,
        ProductsTableSubActionsComponent,
        ItemSearchDialogComponent,
        CategoryCreateFormComponent,
        ExpenseItemsPage,
        AddExpenseItemPage,
        AddExpensePage,
        AddExpensesComponent,
        AddExpenseSearchDialogComponent,
        ExpensesReportComponent,
        ExpenseReportPage,
        ExpenseReportDetailsComponent,
        ExpensesReportByCategoryComponent,
        ExpensesReportByNameComponent,
        AddExpenseSearchBottomSheetComponent
    ]
})
export class ExpenseModule {
  constructor(private readonly expenseNavService: ExpenseNavigationService) {
    expenseNavService.init();
    expenseNavService.selected();
  }
}

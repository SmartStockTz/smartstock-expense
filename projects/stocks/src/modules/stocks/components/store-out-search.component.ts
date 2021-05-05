import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StockModel} from '../models/stock.model';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

// @dynamic
@Component({
  selector: 'app-store-out-search',
  template: `
  `
})
export class StoreOutSearchComponent implements OnInit{
  showProgress = false;
  private currentUser: any;
  creditors: Observable<any[]>;
  customers: Observable<any[]>;
  transferFormGroup: FormGroup;
  transfersDatasource: MatTableDataSource<{ quantity: number, product: StockModel, amount: number }> = new MatTableDataSource([]);
  transfersTableColumn = ['product', 'quantity', 'amount', 'subAmount', 'action'];
  selectedProducts: { quantity: number, product: StockModel, amount: number }[] = [];
  totalCost = 0;
  //
  // constructor(private readonly formBuilder: FormBuilder,
  //             private readonly message: MessageService,
  //             private readonly userService: UserService,
  //             private readonly customerState: CustomerState,
  //             private readonly salesState: SalesState,
  //             private readonly dialog: MatDialog,
  //             private router: Router,
  //             public readonly transferState: TransferState,
  //             public readonly creditorState: CreditorState,
  //             public readonly invoiceState: InvoiceState,
  //             private readonly snack: MatSnackBar) {
  // }

  ngOnInit(): void {
    // this.transferFormGroup = this.formBuilder.group({
    //   date: [new Date(), [Validators.required, Validators.nullValidator]],
    //   dueDate: [new Date(), [Validators.nullValidator]],
    //   note: ['Invoice note', [Validators.nullValidator]],
    //   creditor: [null, [Validators.required, Validators.nullValidator]],
    //   customer: [null, [Validators.required, Validators.nullValidator]],
    //   amount: [null, [Validators.required, Validators.nullValidator]],
    // });
  }


  addProductToTable($event: MouseEvent): void {
    // $event.preventDefault();
    // this.dialog.open(ProductSearchDialogComponent).afterClosed().subscribe(value => {
    //   if (value && value.product) {
    //     this.selectedProducts.unshift({
    //       quantity: 1,
    //       product: value,
    //       amount: 0
    //     });
    //     this.transfersDatasource = new MatTableDataSource<any>(this.selectedProducts);
    //     this.updateTotalCost();
    //   }
    // });
  }

}

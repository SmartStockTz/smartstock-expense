import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService} from '@smartstocktz/core-libs';
import {StockState} from '../states/stock.state';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'smartstock-upload-products',
  template: `
    <div>
      <div class="d-flex flex-row align-items-center" mat-dialog-title>
        Import Products
        <span style="flex-grow: 1"></span>
        <a download="stock.csv" [href]="stocksBlob">Download Sample</a>
        <button (click)="fileU.click()" [disabled]="(stockState.isImportProducts | async)===true" class="ft-button"
                color="primary" mat-flat-button>
          Upload Csv
          <mat-progress-spinner *ngIf="(stockState.isImportProducts | async)===true" style="display: inline-block"
                                diameter="30"
                                mode="indeterminate"></mat-progress-spinner>
        </button>
      </div>
      <mat-divider></mat-divider>
      <div mat-dialog-content>
        <p>
          <br>
          Prepare your excel sheet and change it to CSV then upload it here.<br>
          Your excel sheet must contain the following columns<br>
          <u>Note: CSV delimiter must be </u> ( , )
        </p>
        <div>
          <table class="table table-responsive table-bordered table-hover">
            <tr class="table-data-row">
              <th>Column Name</th>
              <th>Description</th>
            </tr>
            <tr>
              <td>product</td>
              <td>Product name <u>e.g panadol - 10mg</u></td>
            </tr>
            <tr>
              <td>description</td>
              <td>Product description <u>e.g medicine for headache</u></td>
            </tr>
            <tr>
              <td>purchase</td>
              <td>Purchase price of a product <u>e.g 1000</u></td>
            </tr>
            <tr>
              <td>unit</td>
              <td>Unit of a product <u>e.g tablet</u></td>
            </tr>
            <tr>
              <td>retailPrice</td>
              <td>Retail price for a product <u>e.g 1400</u></td>
            </tr>
            <tr>
              <td>wholesalePrice</td>
              <td>Wholesale price for a product <u>e.g 5000</u></td>
            </tr>
            <tr>
              <td>wholesaleQuantity</td>
              <td>how many unit quantity of product to be reduced when product sold as a whole <u>e.g 3</u></td>
            </tr>
            <tr>
              <td>quantity</td>
              <td>Initial stock quantity <u>e.g 200</u></td>
            </tr>
            <tr>
              <td>supplier</td>
              <td>Name of supplier <u>e.g Joe Shop</u></td>
            </tr>
            <tr>
              <td>reorder</td>
              <td>Reorder level <u>e.g 5</u></td>
            </tr>
            <tr>
              <td>category</td>
              <td>Reorder level <u>e.g 5</u></td>
            </tr>
            <tr>
              <td>expire</td>
              <td>Expire date <u>e.g 2050-01-01</u></td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <input #fileU style="display: none" (change)="csvUploaded($event)" type="file" accept=".csv">
  `,
  styleUrls: ['../styles/imports.style.scss']
})
export class ImportsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ImportsDialogComponent>,
              private snack: MatSnackBar,
              private readonly logger: LogService,
              private domSanitizer: DomSanitizer,
              public readonly stockState: StockState) {
  }

  stocksBlob = this.domSanitizer.bypassSecurityTrustUrl(`data:text/csv,product,saleable,downloadable,downloads,stockable,purchasable,description,purchase,retailPrice,wholesalePrice,wholesaleQuantity,quantity,reorder,unit,expire,category,supplier
tshirt,TRUE,FALSE,[],TRUE,TRUE,form six,8000,12000,10000,10,41,10,Pieces ,,male,gervas`);

  private static _sanitizeField(value: string): any {
    value = value.replace(new RegExp('[-,]', 'ig'), '').trim();
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    if (value.trim().startsWith('[', 0)) {
      return JSON.parse(value);
    }
    if (value.trim().startsWith('{', 0)) {
      return JSON.parse(value);
    }
    return value;
  }

  ngOnInit(): void {
  }

  csvUploaded($event: Event): void {
    // @ts-ignore
    const file = $event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (evt) => {
        this.stockState.importProducts(this.csvToJSON(evt.target.result).map((x) => {
          if (x.canExpire && typeof x.canExpire !== 'boolean') {
            x.canExpire = (x.canExpire.toString().toLowerCase() === 'true');
          }
          if (x.downloadable && typeof x.downloadable !== 'boolean') {
            x.downloadable = (x.downloadable.toString().toLowerCase() === 'true');
          }
          if (x.saleable && typeof x.saleable !== 'boolean') {
            x.saleable = (x.saleable.toString().toLowerCase() === 'true');
          }
          if (x.purchasable && typeof x.purchasable !== 'boolean') {
            x.purchasable = (x.purchasable.toString().toLowerCase() === 'true');
          }
          if (x.stockable && typeof x.stockable !== 'boolean') {
            x.stockable = (x.stockable.toString() !== 'true');
          }
          return x;
        }), this.dialogRef);
      };
      fileReader.readAsText(file, 'UTF-8');
    } else {
      this.snack.open('Error while read csv', 'Ok', {
        duration: 3000
      });
    }
  }

  csvToJSON(csv): any[] {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        const originalValue: string = currentline[j];
        let value = originalValue.split('').map((value1, index, array) => {
          if (index === 0 && value1 === '"') {
            return '';
          }
          if (index === array.length - 1 && value1 === '"') {
            return '';
          }
          return value1;
        }).join('');
        value = ImportsDialogComponent._sanitizeField(value);
        obj[headers[j].toString().trim().split('"').join('')] = value;
      }
      result.push(obj);
    }
    return result;
  }
}

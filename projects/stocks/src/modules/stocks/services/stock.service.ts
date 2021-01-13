import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {bfast, BFast} from 'bfastjs';
import {StockModel} from '../models/stock.model';

@Injectable({
  providedIn: 'any'
})
export class StockService {
  constructor(private readonly userService: UserService, private readonly storageService: StorageService) {
  }

  async exportToExcel(): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    const columns = [
      'id',
      'product',
      'category',
      'unit',
      'quantity',
      'retailPrice',
      'wholesalePrice',
      'wholesaleQuantity',
      'purchase',
      'expire',
      'supplier'
    ];
    const total = await bfast.database(activeShop.projectId).table('stocks').query().count(true).find<number>();
    const stocks = await bfast.database(activeShop.projectId).table('stocks').query()
      .skip(0)
      .size(total)
      .orderBy('product', 1)
      .find<StockModel[]>({
        returnFields: columns
      });
    let csv = '';
    csv = csv.concat(columns.join(',')).concat(',\n');
    stocks.forEach(stock => {
      columns.forEach(column => {
        csv = csv.concat(stock[column] ? stock[column].toString().replace(new RegExp('[,-]', 'ig'), '') : '').concat(', ');
      });
      csv = csv.concat('\n');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + csv;
    const url = encodeURI(csvContent);
    const anchor = document.createElement('a');
    anchor.setAttribute('style', 'display: none');
    anchor.download = activeShop.businessName.concat('-stocks.csv').trim();
    anchor.href = url;
    anchor.click();
    return csv;
  }

  async importStocks(stocks: StockModel[]): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast
      .database(shop.projectId)
      .transaction()
      .create('stocks', stocks)
      .commit();
  }

  async addStock(stock: StockModel, inUpdateMode = false): Promise<StockModel> {
    const shop = await this.storageService.getActiveShop();
    if (inUpdateMode) {
      const stockId = stock._id ? stock._id : stock.id;
      delete stock.id;
      delete stock._id;
      delete stock.updatedAt;
      delete stock.createdAt;
      return BFast.database(shop.projectId).collection('stocks')
        .query()
        .byId(stockId)
        .updateBuilder()
        .doc(stock)
        .update();
    } else {
      return BFast.database(shop.projectId).collection('stocks').save(stock);
    }
  }

  async deleteAllStock(stocks: StockModel[], callback?: (value: any) => void): Promise<void> {
  }

  async deleteStock(stock: StockModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').query().byId(stock._id ? stock._id : stock.id).delete();
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId).table('stocks').query().count(true).find<number>();
    const stocks: StockModel[] = await BFast.database(shop.projectId)
      .collection<StockModel>('stocks')
      .query()
      .size(total)
      .skip(0)
      .orderBy('product', 1)
      .find<StockModel[]>();
    await this.storageService.saveStocks(stocks as any);
    return stocks;
  }

  async deleteMany(stocksId: string[]): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId)
      .transaction()
      .delete('stocks', {
        query: {
          filter: {
            $or: stocksId.map(x => {
              return {
                _id: x
              };
            })
          }
        }
      })
      .commit();
  }

  // async updateStock(stock: StockModel, progress: (d) => void): Promise<StockModel> {
  //   const shop = await this._storage.getActiveShop();
  //   const stockId = stock._id ? stock._id : stock.id;
  //   delete stock.id;
  //   if (stock.image && !stock.image.toString().startsWith('http') && stock.image instanceof File) {
  //     stock.image = await BFast.storage(shop.projectId).save(stock.image, progress);
  //   }
  //   if (stock.downloads && stock.downloads.length > 0) {
  //     for (const value of stock.downloads) {
  //       if (value && value.url instanceof File) {
  //         value.url = await BFast.storage(shop.projectId).save(value.url as any, progress);
  //       }
  //     }
  //   }
  //   return BFast.database(shop.projectId).collection('stocks')
  //     .query()
  //     .byId(stockId.trim())
  //     .updateBuilder()
  //     .doc(stock)
  //     .update();
  // }

}

import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {bfast, BFast} from 'bfastjs';
import {ExpenseModel} from '../models/expense.model';
import {ExpenseItemModel} from '../models/expense-item.model';

@Injectable({
  providedIn: 'any'
})
export class ExpenseService {
  constructor(private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }

  async storeFrequencyGroupByCategory(from: string, to: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.database(shop.projectId)
      .table('expenses')
      .query()
      .aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to
            }
          }
        },
        {
          $group: {
            _id: '$item.category',
            total: {$sum: '$amount'}
          }
        }
      ], {});
  }

  async storeFrequencyGroupByTag(from: string, to: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.database(shop.projectId)
      .table('expenses')
      .query()
      .aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to
            }
          }
        },
        {
          $group: {
            _id: '$item.name',
            total: {$sum: '$amount'}
          }
        }
      ], {});
  }

  async storeFrequencyGroupByTagWithTracking(from: string, to: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.database(shop.projectId)
      .table('expenses')
      .query()
      .aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to
            }
          }
        },
        {
          $sort: {
            date: -1,
            time: -1
          }
        },
        {
          $group: {
            _id: '$item.name',
            track: {$push: {date: '$date', amount: '$amount', time: '$time'}},
            total: {$sum: '$amount'}
          }
        },
        {
          $sort: {
            total: -1
          }
        }
      ], {});
  }

  // async exportToExcel(): Promise<any> {
  //   const activeShop = await this.storageService.getActiveShop();
  //   const columns = [
  //     'id',
  //     'product',
  //     'category',
  //     'unit',
  //     'quantity',
  //     'retailPrice',
  //     'wholesalePrice',
  //     'wholesaleQuantity',
  //     'purchase',
  //     'expire',
  //     'supplier'
  //   ];
  //   const total = await bfast.database(activeShop.projectId).table('item').query().count(true).find<number>();
  //   const item = await bfast.database(activeShop.projectId).table('item').query()
  //     .skip(0)
  //     .size(total)
  //     .orderBy('product', 1)
  //     .find<StoreModel[]>({
  //       returnFields: columns
  //     });
  //   let csv = '';
  //   csv = csv.concat(columns.join(',')).concat(',\n');
  //   // tslint:disable-next-line:variable-name
  //   item.forEach(_store => {
  //     columns.forEach(column => {
  //       csv = csv.concat(_store[column] ? _store[column].toString().replace(new RegExp('[,-]', 'ig'), '') : '').concat(', ');
  //     });
  //     csv = csv.concat('\n');
  //   });
  //   const csvContent = 'data:text/csv;charset=utf-8,' + csv;
  //   const url = encodeURI(csvContent);
  //   const anchor = document.createElement('a');
  //   anchor.setAttribute('style', 'display: none');
  //   anchor.download = activeShop.businessName.concat('-item.csv').trim();
  //   anchor.href = url;
  //   anchor.click();
  //   return csv;
  // }

  async addExpenseItem(expenseItem: ExpenseItemModel, inUpdateMode = false): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    console.log(expenseItem);
    console.log(inUpdateMode);
    if (inUpdateMode) {
      const stockId = expenseItem._id ? expenseItem._id : expenseItem.id;
      delete expenseItem.id;
      delete expenseItem._id;
      delete expenseItem.updatedAt;
      delete expenseItem.createdAt;
      return BFast.database(shop.projectId).collection('expense_items')
        .query()
        .byId(stockId)
        .updateBuilder()
        .doc(expenseItem)
        .update();
    } else {
      // tslint:disable-next-line:variable-name
      const _store = {...expenseItem};
      return BFast.database(shop.projectId).collection('expense_items')
        .query()
        .byId(_store.name)
        .updateBuilder()
        .upsert(true)
        .doc(_store)
        .update();
    }
  }

  async addExpenses(storeOutData: ExpenseModel[]): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).table('expenses').save(storeOutData);
    // .update('expenses', storeOutData.map(x => {
    //   return {
    //     query: {
    //       id: x.storeId
    //     },
    //     update: {
    //       $inc: {
    //         quantity: -x.quantity
    //       }
    //     }
    //   };
    // }))
    // return BFast.database(shop.projectId).collection('store_out').save(storeOutData);

  }

  async deleteExpenseItem(expense: ExpenseItemModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('expense_items')
      .query().byId(expense._id ? expense._id : expense.id)
      .delete();
  }

  async getExpenses(): Promise<ExpenseModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId)
      .table('expenses')
      .query()
      .count(true)
      .find<number>();
    return await BFast.database(shop.projectId)
      .collection('expenses')
      .query()
      .size(total)
      .skip(0)
      .find();
  }


  async getExpenseItems(): Promise<ExpenseItemModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId)
      .table('expense_items')
      .query()
      .count(true)
      .find<number>();
    return await BFast.database(shop.projectId)
      .collection('expense_items')
      .query()
      .size(total)
      .skip(0)
      .orderBy('_updated_at', -1)
      .find();
  }

  async getExpenseByDate(date: string): Promise<ExpenseModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId)
      .table('expenses')
      .query()
      .count(true)
      .find<number>();
    return await BFast.database(shop.projectId)
      .collection('expense_items')
      .query()
      .equalTo('date', date)
      .size(total)
      .skip(0)
      .find();
  }

  async deleteManyExpenseItems(expenseItemsIds: string[]): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId)
      .transaction()
      .delete('expense_items', {
        query: {
          filter: {
            $or: expenseItemsIds.map(x => {
              return {
                _id: x
              };
            })
          },
          size: expenseItemsIds.length,
          skip: 0
        }
      })
      .commit();
  }

}

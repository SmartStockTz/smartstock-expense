import {Injectable} from '@angular/core';
import {database} from 'bfast';
import {ExpenseModel} from '../models/expense.model';
import {ExpenseItemModel} from '../models/expense-item.model';
import {IpfsService, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private readonly userService: UserService) {
  }

  async expenseFrequencyGroupByCategory(from: string, to: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const cids: string[] = await database(shop.projectId)
      .table('expenses')
      .query()
      .greaterThanOrEqual('date', from)
      .lessThanOrEqual('date', to)
      .cids(true)
      .find();
    const expenses = await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
    return Object.values(
      expenses.reduce((previousValue, currentValue: ExpenseModel) => {
        const x = previousValue[currentValue.item.category];
        if (x) {
          previousValue[currentValue.item.category].total += currentValue.amount;
        } else {
          previousValue[currentValue.item.category] = {
            id: currentValue.item.category,
            total: currentValue.amount
          };
        }
        return previousValue;
      }, {})
    );
  }

  async expenseFrequencyGroupByTag(from: string, to: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const cids: string[] = await database(shop.projectId)
      .table('expenses')
      .query()
      .greaterThanOrEqual('date', from)
      .lessThanOrEqual('date', to)
      .cids(true)
      .find();
    const expenses = await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
    return Object.values(
      expenses.reduce((previousValue, currentValue: ExpenseModel) => {
        const x = previousValue[currentValue.item.name];
        if (x) {
          previousValue[currentValue.item.name].total += currentValue.amount;
        } else {
          previousValue[currentValue.item.name] = {
            id: currentValue.item.name,
            total: currentValue.amount
          };
        }
        return previousValue;
      }, {})
    );
  }

  async expenseFrequencyGroupByTagWithTracking(from: string, to: string): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const cids: string[] = await database(shop.projectId)
      .table('expenses')
      .query()
      .greaterThanOrEqual('date', from)
      .lessThanOrEqual('date', to)
      .cids(true)
      .find();
    const expenses = await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
    return Object.values(
      expenses.reduce((previousValue, currentValue: ExpenseModel) => {
        const x = previousValue[currentValue.item.name];
        if (x) {
          previousValue[currentValue.item.name].total += currentValue.amount;
          previousValue[currentValue.item.name].track.push({
            date: currentValue.date,
            amount: currentValue.amount,
            // @ts-ignore
            time: currentValue.time,
          });
        } else {
          previousValue[currentValue.item.name] = {
            id: currentValue.item.name,
            track: [{
              date: currentValue.date,
              amount: currentValue.amount,
              // @ts-ignore
              time: currentValue.time,
            }],
            total: currentValue.amount
          };
        }
        return previousValue;
      }, {})
    );
    // const shop = await this.userService.getCurrentShop();
    // return database(shop.projectId)
    //   .table('expenses')
    //   .query()
    //   .aggregate([
    //     {
    //       $match: {
    //         date: {
    //           $gte: from,
    //           $lte: to
    //         }
    //       }
    //     },
    //     {
    //       $sort: {
    //         date: -1,
    //         time: -1
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: '$item.name',
    //         track: {$push: {date: '$date', amount: '$amount', time: '$time'}},
    //         total: {$sum: '$amount'}
    //       }
    //     },
    //     {
    //       $sort: {
    //         total: -1
    //       }
    //     }
    //   ], {});
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
    const shop = await this.userService.getCurrentShop();
    if (inUpdateMode) {
      const stockId = expenseItem._id ? expenseItem._id : expenseItem.id;
      delete expenseItem.id;
      delete expenseItem._id;
      delete expenseItem.updatedAt;
      delete expenseItem.createdAt;
      return database(shop.projectId).collection('expense_items')
        .query()
        .byId(stockId)
        .updateBuilder()
        .doc(expenseItem)
        .update();
    } else {
      // tslint:disable-next-line:variable-name
      const _store = {...expenseItem};
      return database(shop.projectId).collection('expense_items')
        .query()
        .byId(_store.name)
        .updateBuilder()
        .upsert(true)
        .doc(_store)
        .update();
    }
  }

  async addExpenses(storeOutData: ExpenseModel[]): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).table('expenses').save(storeOutData);
  }

  async deleteExpenseItem(expense: ExpenseItemModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).collection('expense_items')
      .query().byId(expense._id ? expense._id : expense.id)
      .delete();
  }

  async getExpenses(): Promise<ExpenseModel[]> {
    const shop = await this.userService.getCurrentShop();
    const total = await database(shop.projectId)
      .table('expenses')
      .query()
      .count(true)
      .find<number>();
    const cids: string[] = await database(shop.projectId)
      .collection('expenses')
      .query()
      .cids(true)
      .size(total)
      .skip(0)
      .find();
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }


  async getExpenseItems(): Promise<ExpenseItemModel[]> {
    const shop = await this.userService.getCurrentShop();
    const total = await database(shop.projectId)
      .table('expense_items')
      .query()
      .count(true)
      .find<number>();
    const cids: string[] = await database(shop.projectId)
      .collection('expense_items')
      .query()
      .cids(true)
      .size(total)
      .skip(0)
      // .orderBy('_updated_at', -1)
      .find();
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }

  async getExpenseByDate(date: string): Promise<ExpenseModel[]> {
    const shop = await this.userService.getCurrentShop();
    const total = await database(shop.projectId)
      .table('expenses')
      .query()
      .equalTo('date', date)
      .count(true)
      .find<number>();
    const cids: string[] = await database(shop.projectId)
      .collection('expense_items')
      .query()
      .cids(true)
      .equalTo('date', date)
      .size(total)
      .skip(0)
      .find();
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }

  async deleteManyExpenseItems(expenseItemsIds: string[]): Promise<any> {
    const activeShop = await this.userService.getCurrentShop();
    return database(activeShop.projectId)
      .bulk()
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

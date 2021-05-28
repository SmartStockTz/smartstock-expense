import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {bfast, BFast} from 'bfastjs';
import {StoreModel} from '../models/store.model';

@Injectable({
  providedIn: 'any'
})
export class StoreService {
  constructor(private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }

  async storeFrequencyGroupByCategory(from: string, to: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.database(shop.projectId)
      .table('store_out')
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
            _id: '$store.category',
            total: {$sum: '$quantity'}
          }
        }
      ], {});
  }

  async storeFrequencyGroupByTag(from: string, to: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.database(shop.projectId)
      .table('store_out')
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
            _id: '$store.tag',
            total: {$sum: '$quantity'}
          }
        }
      ], {});
  }

  async storeFrequencyGroupByTagWithTracking(from: string, to: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return bfast.database(shop.projectId)
      .table('store_out')
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
            _id: '$store.tag',
            track: {$push: {date: '$date', quantity: '$quantity', time: '$time'}},
            total: {$sum: '$quantity'}
          }
        },
        {
          $sort: {
            total: -1
          }
        }
      ], {});
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
    const total = await bfast.database(activeShop.projectId).table('store').query().count(true).find<number>();
    const store = await bfast.database(activeShop.projectId).table('store').query()
      .skip(0)
      .size(total)
      .orderBy('product', 1)
      .find<StoreModel[]>({
        returnFields: columns
      });
    let csv = '';
    csv = csv.concat(columns.join(',')).concat(',\n');
    // tslint:disable-next-line:variable-name
    store.forEach(_store => {
      columns.forEach(column => {
        csv = csv.concat(_store[column] ? _store[column].toString().replace(new RegExp('[,-]', 'ig'), '') : '').concat(', ');
      });
      csv = csv.concat('\n');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + csv;
    const url = encodeURI(csvContent);
    const anchor = document.createElement('a');
    anchor.setAttribute('style', 'display: none');
    anchor.download = activeShop.businessName.concat('-store.csv').trim();
    anchor.href = url;
    anchor.click();
    return csv;
  }

  async addStore(store: any, inUpdateMode = false): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    if (inUpdateMode) {
      const stockId = store._id ? store._id : store.id;
      delete store.id;
      delete store._id;
      delete store.updatedAt;
      delete store.createdAt;
      return BFast.database(shop.projectId).collection('store')
        .query()
        .byId(stockId)
        .updateBuilder()
        .doc(store)
        .update();
    } else {
      // tslint:disable-next-line:variable-name
      const _store = {...store};
      const qty = _store.quantity;
      delete _store.quantity;
      return BFast.database(shop.projectId).collection('store')
        .query()
        .byId(_store.tag)
        .updateBuilder()
        .upsert(true)
        .doc(_store)
        .increment('quantity', qty >= 0 ? qty : 0)
        .update();
    }
  }

  async storeOut(storeOutData: any): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).transaction()
      .create('store_out', storeOutData)
      .update('store', storeOutData.map(x => {
        return {
          query: {
            id: x.storeId
          },
          update: {
            $inc: {
              quantity: -x.quantity
            }
          }
        };
      }))
      .commit();
    // return BFast.database(shop.projectId).collection('store_out').save(storeOutData);

  }

  async deleteAllStore(storeItems: StoreModel[], callback?: (value: any) => void): Promise<void> {
  }

  async deleteStore(store: StoreModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('store').query().byId(store._id ? store._id : store.id).delete();
  }

  async getAllStoreOut(): Promise<StoreModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId).table('store_out').query().count(true).find<number>();
    const storeout: StoreModel[] = await BFast.database(shop.projectId)
      .collection('store_out')
      .query()
      .size(total)
      .skip(0).find();
    // await this.storageService.saveStores(storeItems as any);
    return storeout;
  }


  async getAllStore(): Promise<StoreModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId).table('store').query().count(true).find<number>();
    const storeItems: StoreModel[] = await BFast.database(shop.projectId)
      .collection('store')
      .query()
      .size(total)
      .skip(0)
      .greaterThan('quantity', 0)
      .orderBy('_updated_at', -1)
      .find();
    // await this.storageService.saveStores(storeItems as any);
    return storeItems;
  }

  async getStoreOutByStoreId(storeId: string): Promise<StoreModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId).table('store_out').query().count(true).find<number>();
    const storeItems: [] = await BFast.database(shop.projectId)
      .collection('store_out')
      // .collection<StoreModel>('store')
      .query()
      .searchByRegex('storeId', storeId)
      .size(total)
      .skip(0).find();
    // .orderBy('product', 1)
    // .find<StoreModel[]>();
    // await this.storageService.saveStores(storeItems as any);
    return storeItems;
  }

  async getStoreByDate(date: string): Promise<StoreModel[]> {
    const shop = await this.storageService.getActiveShop();
    const total = await bfast.database(shop.projectId).table('store').query().count(true).find<number>();
    const storeItems: [] = await BFast.database(shop.projectId)
      .collection('store')
      // .collection<StoreModel>('store')
      .query()
      .searchByRegex('date', date)
      .size(total)
      .skip(0).find();
    // .orderBy('product', 1)
    // .find<StoreModel[]>();
    // await this.storageService.saveStores(storeItems as any);
    return storeItems;
  }

  async deleteMany(stocksId: string[]): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId)
      .transaction()
      .delete('store', {
        query: {
          filter: {
            $or: stocksId.map(x => {
              return {
                _id: x
              };
            })
          },
          size: stocksId.length,
          skip: 0
        }
      })
      .commit();
  }

  // async updateStore(store: StoreModel, progress: (d) => void): Promise<StoreModel> {
  //   const shop = await this._storage.getActiveShop();
  //   const stockId = store._id ? store._id : store.id;
  //   delete store.id;
  //   if (store.image && !store.image.toString().startsWith('http') && store.image instanceof File) {
  //     store.image = await BFast.storage(shop.projectId).save(store.image, progress);
  //   }
  //   if (store.downloads && store.downloads.length > 0) {
  //     for (const value of store.downloads) {
  //       if (value && value.url instanceof File) {
  //         value.url = await BFast.storage(shop.projectId).save(value.url as any, progress);
  //       }
  //     }
  //   }
  //   return BFast.database(shop.projectId).collection('storeItems')
  //     .query()
  //     .byId(stockId.trim())
  //     .updateBuilder()
  //     .doc(store)
  //     .update();
  // }

}

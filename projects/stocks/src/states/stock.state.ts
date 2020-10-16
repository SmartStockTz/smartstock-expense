import {Injectable} from '@angular/core';
import {UnitsModel} from '../models/units.model';
import {HttpClient} from '@angular/common/http';
import {SupplierModel} from '../models/supplier.model';
import {CategoryModel} from '../models/category.model';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';
import {StockModel} from '../models/stock.model';
import {CatalogModel} from '../models/catalog.model';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class StockState {

  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }

  async exportToExcel(): Promise<any> {
    const user = await this.userService.currentUser();
    const email = encodeURIComponent(user.email);
    return BFast.functions()
      .request('/functions/stocks/export/' + user.projectId + '/' + email)
      .get({});
  }

  addAllCategory(categories: CategoryModel[], callback?: (value: any) => void) {
  }

  async importStocks(stocks: StockModel[]): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.functions()
      .request('/functions/stocks/import/' + shop.projectId)
      .post(stocks, {});
  }

  addAllSupplier(suppliers: SupplierModel[], callback: (value: any) => void): void {
  }

  async addCategory(category: CategoryModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection<CategoryModel>('categories').save(category);
  }

  async addCatalog(catalogModel: CatalogModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection<CategoryModel>('catalogs').save(catalogModel);
  }

  async addUnit(unit: UnitsModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection<UnitsModel>('units').save(unit);
  }

  async getAllUnit(pagination: { size?: number, skip?: number }): Promise<UnitsModel[]> {
    const shop = await this.storageService.getActiveShop();
    const units = await BFast.database(shop.projectId).collection('units').getAll<UnitsModel>();
    units.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return units;
  }

  async addStock(stock: StockModel, progress: (d: any, name: string) => void, inUpdateMode = false): Promise<StockModel> {
    const shop = await this.storageService.getActiveShop();
    if (stock.downloads && stock.downloads.length > 0) {
      for (const value of stock.downloads) {
        if (value && value.url instanceof File) {
          value.url = await BFast.storage(shop?.projectId).save(value.url as any, progress1 => {
            progress((Number(progress1.loaded) / Number(progress1.total) * 100), value.name);
          });
        }
      }
    }
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

  async addSupplier(supplier: SupplierModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').save(supplier);
  }

  deleteAllCategory(categories: CategoryModel[], callback: (value: any) => void): void {
  }

  deleteAllStock(stocks: StockModel[], callback?: (value: any) => void): void {
  }

  async deleteCategory(category: CategoryModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('categories').query().byId(category.id).delete();
  }

  async deleteCatalog(catalog: CatalogModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('catalogs').query().byId(catalog.id).delete();
  }

  async deleteStock(stock: StockModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').query().byId(stock._id ? stock._id : stock.id).delete();
  }

  async deleteSupplier(id: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').query().byId(id).delete();
  }

  async getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryModel[]> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('categories').getAll(null, {
      cacheEnable: true,
      dtl: 7,
      freshDataCallback: value => {
        // console.log(value);
      }
    });
  }

  async getAllCatalogs(pagination: { size?: number, skip?: number }): Promise<CategoryModel[]> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('catalogs').getAll(null);
  }

  async getAllStock(): Promise<StockModel[]> {
    const shop = await this.storageService.getActiveShop();
    // const totalStock = await BFast.database(shop.projectId)
    //   .collection('stocks')
    //   .query()
    //   .count({}, {cacheEnable: false, dtl: 0});
    const stocks: StockModel[] = await BFast.database(shop.projectId)
      .collection<StockModel>('stocks')
      .getAll<StockModel>(undefined, {
        cacheEnable: false,
        dtl: 0
      });
    await this.storageService.saveStocks(stocks);
    // stocks.sort((a, b) => {
    //   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    // });
    return stocks;
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierModel[]> {
    const shop = await this.storageService.getActiveShop();
    const suppliers: SupplierModel[] = await BFast.database(shop.projectId).collection<SupplierModel>('suppliers').getAll<SupplierModel>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  getCategory(id: string, callback: (category: CategoryModel) => void) {
  }

  async getStock(id: string, callback: (stock: StockModel) => void) {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('stocks').get(id);
  }

  getSupplier(id: string, callback: (supplier: SupplierModel) => void) {
  }

  updateAllCategory(categories: CategoryModel[], callback?: (value: any) => void) {
  }

  updateAllStock(stocks: StockModel[], callback?: (value: any) => void) {
  }

  updateAllSupplier(callback?: (value: any) => void) {
  }


  async updateCategory(category: { id: string, value: string, field: string }): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    const categoryId = category.id;
    const data = {};
    data[category.field] = category.value;
    delete category.id;
    const response = await BFast.database(shop.projectId).collection('categories')
      .query()
      .byId(categoryId)
      .updateBuilder()
      .set(category.field, category.value)
      .update();
    response.id = categoryId;
    return response;
  }

  async updateCatalog(category: { id: string, value: string, field: string }): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    const catalogId = category.id;
    const data = {};
    data[category.field] = category.value;
    delete category.id;
    const response = await BFast.database(shop.projectId).collection('catalogs')
      .query()
      .byId(catalogId)
      .updateBuilder()
      .set(category.field, category.value)
      .update();
    response.id = catalogId;
    return response;
  }

  async updateCategoryMobile(category: CategoryModel, categoryId): Promise<any> {
    const activeShop = await this.storageService.getActiveShop();
    return BFast.database(activeShop.projectId).collection('categories')
      .query()
      .byId(categoryId)
      .updateBuilder()
      .doc(category)
      .update();
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

  async updateSupplier(value: { id: string, field: string, value: string }): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    const supplierId = value.id;
    const data = {};
    data[value.field] = value.value;
    delete value.id;
    const response = await BFast.database(shop.projectId).collection('suppliers')
      .query()
      .byId(supplierId)
      .updateBuilder()
      .set(value.field, value.value)
      .update();
    response.id = supplierId;
    return response;
  }

  async updateUnit(unit: { id: string; value: string; field: string }): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    const unitId = unit.id;
    const data = {};
    data[unit.field] = unit.value;

    delete unit.id;
    const response = await BFast.database(shop.projectId).collection('units')
      .query()
      .byId(unitId)
      .updateBuilder()
      .set(unit.field, unit.value)
      .update();
    response.id = unitId;
    return response;
  }

  async deleteUnit(unit: UnitsModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('units').query().byId(unit.id).delete();
  }
}

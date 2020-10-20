import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {CatalogModel} from '../models/catalog.model';
import {BFast} from 'bfastjs';
import {CategoryModel} from '../models/category.model';

@Injectable({
  providedIn: 'root'
})

export class CatalogService{
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }

  async addCatalog(catalogModel: CatalogModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection<CategoryModel>('catalogs').save(catalogModel);
  }

  async deleteCatalog(catalog: CatalogModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('catalogs').query().byId(catalog.id).delete();
  }

  async getAllCatalogs(pagination: { size?: number, skip?: number }): Promise<CategoryModel[]> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('catalogs').getAll(null);
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
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {CategoryModel} from '../models/category.model';
import {BFast} from 'bfastjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }

  async addCategory(expenseCategory: CategoryModel, id = null): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    if (id) {
      return BFast.database(shop.projectId)
        .collection('expense_categories')
        .query()
        .byId(id)
        .updateBuilder()
        .doc(expenseCategory)
        .update();
    } else {
      return BFast.database(shop.projectId).collection<CategoryModel>('expense_categories').save(expenseCategory);
    }
  }

  async deleteCategory(category: CategoryModel): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('expense_categories').query().byId(category.id).delete();
  }

  async getAllCategory(pagination: { size?: number, skip?: number }): Promise<CategoryModel[]> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('expense_categories').getAll();
  }

  getCategory(id: string, callback: (category: CategoryModel) => void): void {
  }

  async updateCategory(category: { id: string, value: string, field: string }): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    const categoryId = category.id;
    const data = {};
    data[category.field] = category.value;
    delete category.id;
    const response = await BFast.database(shop.projectId).collection('expense_categories')
      .query()
      .byId(categoryId)
      .updateBuilder()
      .set(category.field, category.value)
      .update();
    response.id = categoryId;
    return response;
  }

}

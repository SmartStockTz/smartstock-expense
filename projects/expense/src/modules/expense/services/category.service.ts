import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SecurityUtil, UserService} from '@smartstocktz/core-libs';
import {CategoryModel} from '../models/category.model';
import {database} from 'bfast';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService) {
  }

  async addCategory(expenseCategory: CategoryModel, id = null): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    if (id) {
      return database(shop.projectId).table('expense_categories')
        .query().byId(id)
        .updateBuilder()
        .doc(expenseCategory)
        .update();
    } else {
      return database(shop.projectId).table('expense_categories').save(expenseCategory);
    }
  }

  async deleteCategory(category: CategoryModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).table('expense_categories').query().byId(category.id).delete();
  }

  async getAllCategory(): Promise<CategoryModel[]> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).table('expense_categories').getAll();
  }

  async getAllCategoryRemote(): Promise<CategoryModel[]> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).table('expense_categories').getAll();
  }

  async getCategory(id: string): Promise<void> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).table('expense_categories').get(id);
  }

  async updateCategory(category: { id: string, value: string, field: string }): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).table('expense_categories')
      .query()
      .byId(category.id)
      .updateBuilder()
      .set(category.field, category.value)
      .update();
  }

}

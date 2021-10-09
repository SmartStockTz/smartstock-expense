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
      let oc = database(shop.projectId).syncs('expense_categories').changes().get(id);
      oc.updatedAt = new Date().toISOString();
      oc = Object.assign(oc, expenseCategory);
      database(shop.projectId).syncs('expense_categories').changes().set(oc);
      return oc;
    } else {
      expenseCategory.id = SecurityUtil.generateUUID();
      expenseCategory.createdAt = new Date().toISOString();
      expenseCategory.updatedAt = new Date().toISOString();
      database(shop.projectId).syncs('expense_categories').changes().set(expenseCategory as any);
      return expenseCategory;
    }
  }

  async deleteCategory(category: CategoryModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    database(shop.projectId).syncs('expense_categories').changes().delete(category.id);
    return {id: category.id};
  }

  async getAllCategory(): Promise<CategoryModel[]> {
    const shop = await this.userService.getCurrentShop();
    const e = await database(shop.projectId)
      .syncs('expense_categories')
      .changes().values();
    return Array.from(e);
  }

  async getAllCategoryRemote(): Promise<CategoryModel[]> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).syncs('expense_categories').upload();
  }

  async getCategory(id: string): Promise<void> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).syncs('expense_categories').changes().get(id);
  }

  async updateCategory(category: { id: string, value: string, field: string }): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const oc = database(shop.projectId).syncs('expense_categories').changes().get(category.id);
    oc.updatedAt = new Date().toISOString();
    oc[category.field] = category.value;
    database(shop.projectId).syncs('expense_categories').changes().set(oc);
    return oc;
  }

}

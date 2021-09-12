import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IpfsService, UserService} from '@smartstocktz/core-libs';
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
      return database(shop.projectId)
        .collection('expense_categories')
        .query()
        .byId(id)
        .updateBuilder()
        .doc(expenseCategory)
        .update();
    } else {
      return database(shop.projectId).collection<CategoryModel>('expense_categories').save(expenseCategory);
    }
  }

  async deleteCategory(category: CategoryModel): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId).collection('expense_categories').query().byId(category.id).delete();
  }

  async getAllCategory(): Promise<CategoryModel[]> {
    const shop = await this.userService.getCurrentShop();
    const cids = await database(shop.projectId)
      .collection('expense_categories')
      .getAll<string>({
        cids: true
      });
    return await Promise.all(
      cids.map(c => {
        return IpfsService.getDataFromCid(c);
      })
    ) as any[];
  }

  getCategory(id: string, callback: (category: CategoryModel) => void): void {
  }

  async updateCategory(category: { id: string, value: string, field: string }): Promise<any> {
    const shop = await this.userService.getCurrentShop();
    const categoryId = category.id;
    const data = {};
    data[category.field] = category.value;
    delete category.id;
    const response = await database(shop.projectId).collection('expense_categories')
      .query()
      .byId(categoryId)
      .updateBuilder()
      .set(category.field, category.value)
      .update();
    response.id = categoryId;
    return response;
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {SupplierModel} from '../models/supplier.model';
import {BFast} from 'bfastjs';

@Injectable({
  providedIn: 'root'
})

export class SupplierService {
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService,
              private readonly storageService: StorageService) {
  }

  async addSupplier(supplier: SupplierModel, id: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    if (id) {
      return BFast.database(shop.projectId)
        .collection('suppliers')
        .query()
        .byId(id)
        .updateBuilder()
        .doc(supplier)
        .update();
    } else {
      return BFast.database(shop.projectId)
        .collection('suppliers')
        .save(supplier);
    }
  }

  async deleteSupplier(id: string): Promise<any> {
    const shop = await this.storageService.getActiveShop();
    return BFast.database(shop.projectId).collection('suppliers').query().byId(id).delete();
  }

  async getAllSupplier(pagination: { size?: number, skip?: number }): Promise<SupplierModel[]> {
    const shop = await this.storageService.getActiveShop();
    const suppliers: SupplierModel[] = await BFast.database(shop.projectId).collection<SupplierModel>('suppliers').getAll<SupplierModel>();
    suppliers.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return suppliers;
  }

  updateAllSupplier(callback?: (value: any) => void): void {
  }

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
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {StorageService} from '@smartstocktz/core-libs';
import {BFast} from 'bfastjs';
import {UnitsModel} from '../models/units.model';

@Injectable({
  providedIn: 'root'
})

export class UnitsService {
  constructor(private readonly httpClient: HttpClient,
              private readonly userService: UserService,
              private readonly storageService: StorageService) {
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

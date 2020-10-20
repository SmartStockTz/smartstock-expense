import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ShopModel} from '../models/shop.model';
import {StorageService} from '@smartstocktz/core-libs';
import {BFast} from 'bfastjs';
import {MatDialog} from '@angular/material/dialog';
import {LogService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly httpClient: HttpClient,
              private readonly dialog: MatDialog,
              private readonly logger: LogService,
              private readonly storageService: StorageService) {
  }

  async currentUser(): Promise<any> {
    const user = await BFast.auth().currentUser();
    if (user && user.role !== 'admin') {
      return user;
    } else if (user && user.verified === true) {
      return user;
    } else {
      return await BFast.auth().setCurrentUser(undefined);
    }
  }

  // async getShops(): Promise<ShopModel[]> {
  //   try {
  //     const user = await this.storageService.getActiveUser();
  //     const shops = [];
  //     user.shops.forEach(element => {
  //       shops.push(element);
  //     });
  //     shops.push({
  //       businessName: user.businessName,
  //       projectId: user.projectId,
  //       applicationId: user.applicationId,
  //       projectUrlId: user.projectUrlId,
  //       settings: user.settings,
  //       street: user.street,
  //       country: user.country,
  //       region: user.region
  //     });
  //     return shops;
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  async getCurrentShop(): Promise<ShopModel> {
    try {
      const activeShop = await this.storageService.getActiveShop();
      if (activeShop && activeShop.projectId && activeShop.applicationId && activeShop.projectUrlId) {
        return activeShop;
      } else {
        throw new Error('No active shop in records');
      }
    } catch (e) {
      throw e;
    }
  }

  async saveCurrentShop(shop: ShopModel): Promise<ShopModel> {
    try {
      await this.storageService.saveCurrentProjectId(shop.projectId);
      return await this.storageService.saveActiveShop(shop);
    } catch (e) {
      throw e;
    }
  }

}

import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';
import {TransferModel} from '../models/transfer.model';

@Injectable({
  providedIn: 'any'
})

export class TransferService {
  private COLLECTION = 'transfers';

  constructor(private readonly storage: StorageService) {
  }

  async save(transfer: TransferModel): Promise<TransferModel> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection(this.COLLECTION)
      .save<TransferModel>(transfer);
  }

  async fetch(pagination: { size?: number, skip?: number } = {size: 20, skip: 0}): Promise<TransferModel[]> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection(this.COLLECTION)
      .query()
      .size(pagination.size)
      .skip(pagination.skip)
      .find();
  }

  async searchByDate(date: string): Promise<TransferModel[]> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database()
      .collection(this.COLLECTION)
      .query()
      .searchByRegex('date', date)
      .find();
  }
}

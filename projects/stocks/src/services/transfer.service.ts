import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';
import {TransactionModel} from 'bfastjs/dist/models/TransactionModel';

@Injectable({
  providedIn: 'any'
})

export class TransferService {
  private COLLECTION = 'transfers';

  constructor(private readonly storage: StorageService) {
  }

  async save(transfer: TransactionModel): Promise<TransactionModel> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection(this.COLLECTION)
      .save<TransactionModel>(transfer);
  }

  async fetch(pagination: { size?: number, skip?: number } = {size: 20, skip: 0}): Promise<TransactionModel[]> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database(activeShop.projectId)
      .collection(this.COLLECTION)
      .query()
      .size(pagination.size)
      .skip(pagination.skip)
      .find();
  }

  async searchByDate(date: string): Promise<TransactionModel[]> {
    const activeShop = await this.storage.getActiveShop();
    return BFast.database()
      .collection(this.COLLECTION)
      .query()
      .searchByRegex('date', date)
      .find();
  }
}

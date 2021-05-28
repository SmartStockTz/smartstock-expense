import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MessageService, toSqlDate} from '@smartstocktz/core-libs';
import {MatDialogRef} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {StoreModel} from '../models/store.model';
import {StoreService} from '../services/store.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'any'
})
export class StoreState {

  reportStartDate: BehaviorSubject<string> = new BehaviorSubject<any>(moment().startOf('month').format('YYYY-MM-DD'));
  reportEndDate: BehaviorSubject<string> = new BehaviorSubject<any>(moment().endOf('month').format('YYYY-MM-DD'));
  storeItems: BehaviorSubject<StoreModel[]> = new BehaviorSubject<StoreModel[]>([]);
  selectedStore: BehaviorSubject<StoreModel> = new BehaviorSubject<StoreModel>(null);
  isFetchStores: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isExportToExcel: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isImportProducts: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDeleteStores: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  totalValidStores: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalValueOfStores: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isFetchCategoryReport: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFetchTagReport: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFetchTagWithTrackReport: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  storeReportByCategory: BehaviorSubject<{ id: string, total: any }[]> = new BehaviorSubject<any[]>(null);
  storeReportByTag: BehaviorSubject<{ id: string, total: any }[]> = new BehaviorSubject<any[]>(null);
  storeReportByTagWithTrack: BehaviorSubject<{ id: string, total: any }[]> = new BehaviorSubject<any[]>(null);

  selection = new SelectionModel(true, []);

  constructor(private readonly storeService: StoreService,
              private readonly messageService: MessageService) {
  }

  async reloadReport(range: { start: any, end: any }): Promise<any> {
    this.reportStartDate.next(range.start);
    this.reportEndDate.next(range.end);
    this.storeFrequencyGroupByTagWithTracking(range.start, range.end);
    this.storeFrequencyGroupByCategory(range.start, range.end);
    this.storeFrequencyGroupByTag(range.start, range.end);
  }

  async storeFrequencyGroupByCategory(from: string, to: string): Promise<any> {
    this.isFetchCategoryReport.next(true);
    return this.storeService.storeFrequencyGroupByCategory(from, to)
      .then(value => {
        this.storeReportByCategory.next(value);
        return value;
      }).catch(reason => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          'bottom');
      }).finally(() => {
        this.isFetchCategoryReport.next(false);
      });
  }

  async storeFrequencyGroupByTag(from: string, to: string): Promise<any> {
    this.isFetchTagReport.next(true);
    return this.storeService.storeFrequencyGroupByTag(from, to)
      .then(value => {
        this.storeReportByTag.next(value);
        return value;
      }).catch(reason => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          'bottom');
      }).finally(() => {
        this.isFetchTagReport.next(false);
      });
  }

  async storeFrequencyGroupByTagWithTracking(from: string, to: string): Promise<any> {
    this.isFetchTagWithTrackReport.next(true);
    return this.storeService.storeFrequencyGroupByTagWithTracking(from, to)
      .then(value => {
        this.storeReportByTagWithTrack.next(value);
        return value;
      }).catch(reason => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          'bottom');
      }).finally(() => {
        this.isFetchTagWithTrackReport.next(false);
      });
  }

  async getStores(): Promise<any> {
    this.isFetchStores.next(true);
    this.storeService.getAllStore().then(storeItems => {
      if (storeItems && Array.isArray(storeItems) && storeItems.length > 0) {
        this.storeItems.next(storeItems);
        return storeItems;
      } else {
        return [];
      }
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message
          ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isFetchStores.next(false);
    });
  }

  private _updateTotalAvailableStores(total: number): void {
    this.totalValidStores.next(total);
  }

  private _updateStoresValue(total: number): void {
    this.totalValueOfStores.next(total);
  }

  getStoresSummary(): void {

  }

  getStoresFromRemote(): void {
    this.isFetchStores.next(true);
    this.storeService.getAllStore().then(storeItems => {
      this.storeItems.next(storeItems);
      return storeItems;
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message
          ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isFetchStores.next(false);
    });
  }

  getStoreSummary(): Promise<any> {
    this.isFetchStores.next(true);
    return this.storeService.getStoreByDate(toSqlDate(new Date(new Date().setDate(4)))).then(storeItems => {
      console.log(new Date(new Date().setDate(4)));
      console.log(storeItems);
      return storeItems;
      // this.storeItems.next(storeItems);
      // return this.storageService.saveStore(storeItems as any);
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message
          ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isFetchStores.next(false);
    });
  }

  exportToExcel(): void {
    this.isExportToExcel.next(true);

    this.storeService.exportToExcel().then(value => {
      this.messageService.showMobileInfoMessage(
        'Stores sent to your email, visit your email to download it', 1000, 'bottom');
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason, 1000, 'bottom');
    }).finally(() => {
      this.isExportToExcel.next(false);
    });
  }

  importProducts(stocks: StoreModel[], dialog: MatDialogRef<any>): void {
  }

  deleteStore(store: StoreModel): void {
    this.isFetchStores.next(true);
    this.storeService.deleteStore(store).then(__1 => {
      this.storeItems.next(this.storeItems.value.filter(x => x.id !== store.id) as any);
      this.messageService.showMobileInfoMessage('Store updated', 1000, 'bottom');
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason, 1000, 'bottom');
    }).finally(() => {
      this.isFetchStores.next(false);
    });
  }

  filter(query: string): void {
  }

  deleteManyStores(selectionModel: SelectionModel<StoreModel>): void {
    this.isDeleteStores.next(true);
    this.storeService.deleteMany(selectionModel.selected.map(x => x.id)).then(_ => {
      this.messageService.showMobileInfoMessage('Products deleted', 2000, 'bottom');
      this.storeItems.next(this.storeItems.value.filter(x => selectionModel.selected.findIndex(y => y.id === x.id) === -1));
      selectionModel.clear();
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isDeleteStores.next(false);
    });
  }
}

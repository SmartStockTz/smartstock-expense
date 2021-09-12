import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MessageService, toSqlDate} from '@smartstocktz/core-libs';
import {SelectionModel} from '@angular/cdk/collections';
import {ExpenseItemModel} from '../models/expense-item.model';
import {ExpenseService} from '../services/expense.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'any'
})
export class ExpenseState {

  reportStartDate: BehaviorSubject<string> = new BehaviorSubject<any>(moment().startOf('month').format('YYYY-MM-DD'));
  reportEndDate: BehaviorSubject<string> = new BehaviorSubject<any>(moment().endOf('month').format('YYYY-MM-DD'));
  expenseItems: BehaviorSubject<ExpenseItemModel[]> = new BehaviorSubject<ExpenseItemModel[]>([]);
  selectedExpenseItem: BehaviorSubject<ExpenseItemModel> = new BehaviorSubject<ExpenseItemModel>(null);
  isFetchExpenseItems: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDeleteExpenseItems: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  totalValidStores: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalValueOfStores: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isFetchCategoryReport: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFetchTagReport: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFetchTagWithTrackReport: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  expenseReportByCategory: BehaviorSubject<{ id: string, total: any }[]> = new BehaviorSubject<any[]>(null);
  expenseReportByTag: BehaviorSubject<{ id: string, total: any }[]> = new BehaviorSubject<any[]>(null);
  expenseReportByTagWithTrack: BehaviorSubject<{ id: string, total: any }[]> = new BehaviorSubject<any[]>(null);

  selection = new SelectionModel(true, []);

  constructor(private readonly storeService: ExpenseService,
              private readonly messageService: MessageService) {
  }

  async reloadReport(range: { start: any, end: any }): Promise<any> {
    this.reportStartDate.next(range.start);
    this.reportEndDate.next(range.end);
    this.expenseFrequencyGroupByTagWithTracking(range.start, range.end).catch(console.log);
    this.expenseFrequencyGroupByCategory(range.start, range.end).catch(console.log);
    this.expenseFrequencyGroupByTag(range.start, range.end).catch(console.log);
  }

  async expenseFrequencyGroupByCategory(from: string, to: string): Promise<any> {
    this.isFetchCategoryReport.next(true);
    return this.storeService.expenseFrequencyGroupByCategory(from, to)
      .then(value => {
        this.expenseReportByCategory.next(value);
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

  async expenseFrequencyGroupByTag(from: string, to: string): Promise<any> {
    this.isFetchTagReport.next(true);
    return this.storeService.expenseFrequencyGroupByTag(from, to)
      .then(value => {
        this.expenseReportByTag.next(value);
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

  async expenseFrequencyGroupByTagWithTracking(from: string, to: string): Promise<any> {
    this.isFetchTagWithTrackReport.next(true);
    return this.storeService.expenseFrequencyGroupByTagWithTracking(from, to)
      .then(value => {
        this.expenseReportByTagWithTrack.next(value);
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

  async getExpenseItems(): Promise<any> {
    this.isFetchExpenseItems.next(true);
    this.storeService.getExpenseItems().then(storeItems => {
      if (storeItems && Array.isArray(storeItems) && storeItems.length > 0) {
        this.expenseItems.next(storeItems);
        return storeItems;
      } else {
        return [];
      }
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message
          ? reason.message : reason, 2000, 'bottom'
      );
    }).finally(() => {
      this.isFetchExpenseItems.next(false);
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
    this.isFetchExpenseItems.next(true);
    this.storeService.getExpenseItems().then(storeItems => {
      this.expenseItems.next(storeItems);
      return storeItems;
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message
          ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isFetchExpenseItems.next(false);
    });
  }

  getStoreSummary(): Promise<any> {
    this.isFetchExpenseItems.next(true);
    return this.storeService.getExpenseByDate(toSqlDate(new Date(new Date().setDate(4)))).then(storeItems => {
      console.log(new Date(new Date().setDate(4)));
      console.log(storeItems);
      return storeItems;
      // this.expenseItems.next(expenseItems);
      // return this.storageService.saveStore(expenseItems as any);
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message
          ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isFetchExpenseItems.next(false);
    });
  }

  deleteExpenseItem(store: ExpenseItemModel): void {
    this.isFetchExpenseItems.next(true);
    this.storeService.deleteExpenseItem(store).then(__1 => {
      this.expenseItems.next(this.expenseItems.value.filter(x => x.id !== store.id) as any);
      this.messageService.showMobileInfoMessage('Store updated', 1000, 'bottom');
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason, 1000, 'bottom');
    }).finally(() => {
      this.isFetchExpenseItems.next(false);
    });
  }

  filter(query: string): void {
  }

  deleteManyExpenseItems(selectionModel: SelectionModel<ExpenseItemModel>): void {
    this.isDeleteExpenseItems.next(true);
    this.storeService.deleteManyExpenseItems(selectionModel.selected.map(x => x.id)).then(_ => {
      this.messageService.showMobileInfoMessage('Products deleted', 2000, 'bottom');
      this.expenseItems.next(this.expenseItems.value.filter(x => selectionModel.selected.findIndex(y => y.id === x.id) === -1));
      selectionModel.clear();
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(
        reason && reason.message ? reason.message : reason, 2000, 'bottom');
    }).finally(() => {
      this.isDeleteExpenseItems.next(false);
    });
  }
}

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MessageService, toSqlDate } from "smartstock-core";
import { SelectionModel } from "@angular/cdk/collections";
import { ExpenseItemModel } from "../models/expense-item.model";
import { ExpenseService } from "../services/expense.service";
import { MatTableDataSource } from "@angular/material/table";
import * as moment from "moment";

@Injectable({
  providedIn: "any"
})
export class ExpenseState {
  reportStartDate = new BehaviorSubject<any>(new Date());
  reportEndDate = new BehaviorSubject<any>(new Date());
  expenseItems = new MatTableDataSource<ExpenseItemModel>([]);
  selectedExpenseItem = new BehaviorSubject<ExpenseItemModel>(null);
  isFetchExpenseItems = new BehaviorSubject<boolean>(false);
  isDeleteExpenseItems = new BehaviorSubject<boolean>(false);
  totalValidStores = new BehaviorSubject<number>(0);
  totalValueOfStores = new BehaviorSubject<number>(0);
  isFetchCategoryReport = new BehaviorSubject<boolean>(false);
  isFetchTagReport = new BehaviorSubject<boolean>(false);
  isFetchTagWithTrackReport = new BehaviorSubject<boolean>(false);
  expenseReportByCategory: BehaviorSubject<
    { id: string; total: any }[]
  > = new BehaviorSubject<any[]>(null);
  expenseReportByTag: BehaviorSubject<
    { id: string; total: any }[]
  > = new BehaviorSubject<any[]>(null);
  expenseReportByTagWithTrack: BehaviorSubject<
    { id: string; total: any }[]
  > = new BehaviorSubject<any[]>(null);

  selection = new SelectionModel(true, []);

  constructor(
    private readonly storeService: ExpenseService,
    private readonly messageService: MessageService
  ) {}

  async reloadReport(range: { start: any; end: any }): Promise<any> {
    range.start = moment(range.start).format("YYYY-MM-DD");
    range.end = moment(range.end).format("YYYY-MM-DD");
    this.reportStartDate.next(range.start);
    this.reportEndDate.next(range.end);
    this.expenseFrequencyGroupByTagWithTracking(range.start, range.end).catch(
      console.log
    );
    this.expenseFrequencyGroupByCategory(range.start, range.end).catch(
      console.log
    );
    this.expenseFrequencyGroupByTag(range.start, range.end).catch(console.log);
  }

  async expenseFrequencyGroupByCategory(
    from: string,
    to: string
  ): Promise<any> {
    from = moment(from).format("YYYY-MM-DD");
    to = moment(to).format("YYYY-MM-DD");
    this.isFetchCategoryReport.next(true);
    return this.storeService
      .expenseFrequencyGroupByCategory(from, to)
      .then((value) => {
        this.expenseReportByCategory.next(value);
        return value;
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchCategoryReport.next(false);
      });
  }

  async expenseFrequencyGroupByTag(from: string, to: string): Promise<any> {
    from = moment(from).format("YYYY-MM-DD");
    to = moment(to).format("YYYY-MM-DD");
    this.isFetchTagReport.next(true);
    return this.storeService
      .expenseFrequencyGroupByTag(from, to)
      .then((value) => {
        this.expenseReportByTag.next(value);
        return value;
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchTagReport.next(false);
      });
  }

  async expenseFrequencyGroupByTagWithTracking(
    from: string,
    to: string
  ): Promise<any> {
    from = moment(from).format("YYYY-MM-DD");
    to = moment(to).format("YYYY-MM-DD");
    this.isFetchTagWithTrackReport.next(true);
    return this.storeService
      .expenseFrequencyGroupByTagWithTracking(from, to)
      .then((value) => {
        this.expenseReportByTagWithTrack.next(value);
        return value;
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason.toString(),
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchTagWithTrackReport.next(false);
      });
  }

  async getExpenseItems(): Promise<any> {
    this.isFetchExpenseItems.next(true);
    this.storeService
      .getExpenseItems()
      .then((expenseItems) => {
        if (
          expenseItems &&
          Array.isArray(expenseItems) &&
          expenseItems.length > 0
        ) {
          this.expenseItems.data = expenseItems;
          return expenseItems;
        } else {
          return [];
        }
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchExpenseItems.next(false);
      });
  }

  private _updateTotalAvailableStores(total: number): void {
    this.totalValidStores.next(total);
  }

  private _updateStoresValue(total: number): void {
    this.totalValueOfStores.next(total);
  }

  getStoresFromRemote(): void {
    this.isFetchExpenseItems.next(true);
    this.storeService
      .getExpenseItems()
      .then((items) => {
        this.expenseItems.data = items;
        return items;
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchExpenseItems.next(false);
      });
  }

  getStoreSummary(): Promise<any> {
    this.isFetchExpenseItems.next(true);
    return this.storeService
      .getExpenseByDate(toSqlDate(new Date()))
      .then((storeItems) => {
        return storeItems;
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchExpenseItems.next(false);
      });
  }

  deleteExpenseItem(store: ExpenseItemModel): void {
    this.isFetchExpenseItems.next(true);
    this.storeService
      .deleteExpenseItem(store)
      .then((__1) => {
        this.expenseItems.data = this.expenseItems.data.filter(
          (x) => x.id !== store.id
        ) as any;
        this.messageService.showMobileInfoMessage(
          "Store updated",
          1000,
          "bottom"
        );
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          1000,
          "bottom"
        );
      })
      .finally(() => {
        this.isFetchExpenseItems.next(false);
      });
  }

  filter(query: string): void {
    // console.log(query);
    this.expenseItems.filter = query.toLowerCase();
    // return this.expenseItems.data;
  }

  deleteManyExpenseItems(
    selectionModel: SelectionModel<ExpenseItemModel>
  ): void {
    this.isDeleteExpenseItems.next(true);
    this.storeService
      .deleteManyExpenseItems(selectionModel.selected.map((x) => x.id))
      .then((_) => {
        this.messageService.showMobileInfoMessage(
          "Products deleted",
          2000,
          "bottom"
        );
        this.expenseItems.data = this.expenseItems.data.filter(
          (x) => selectionModel.selected.findIndex((y) => y.id === x.id) === -1
        );
        selectionModel.clear();
      })
      .catch((reason) => {
        this.messageService.showMobileInfoMessage(
          reason && reason.message ? reason.message : reason,
          2000,
          "bottom"
        );
      })
      .finally(() => {
        this.isDeleteExpenseItems.next(false);
      });
  }
}

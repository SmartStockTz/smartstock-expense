import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {TransactionModel} from "bfastjs/dist/models/TransactionModel";
import {TransferService} from "../services/transfer.service";
import {MessageService} from "@smartstocktz/core-libs";

@Injectable({
  providedIn: "any"
})

export class TransferState {
  constructor(private readonly transferService: TransferService,
              private readonly messageService: MessageService) {
  }

  transfers: BehaviorSubject<TransactionModel[]> = new BehaviorSubject<TransactionModel[]>([]);
  isFetchTransfers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  fetch(size = 20, skip = 0): void {
    this.isFetchTransfers.next(true);
    this.transferService.fetch({
      skip,
      size
    }).then(value => {
      this.transfers.next(value ? value : []);
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(reason && reason.message ? reason.message : reason.toString(), 2000, 'bottom');
    }).finally(() => {
      this.isFetchTransfers.next(false);
    });
  }
}

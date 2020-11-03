import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TransferService} from '../services/transfer.service';
import {MessageService} from '@smartstocktz/core-libs';
import {TransferModel} from '../models/transfer.model';

@Injectable({
  providedIn: 'any'
})

export class TransferState {
  constructor(private readonly transferService: TransferService,
              private readonly messageService: MessageService) {
  }

  transfers: BehaviorSubject<TransferModel[]> = new BehaviorSubject<TransferModel[]>([]);
  isFetchTransfers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSaveTransfers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  save(transfer: TransferModel): void {
    this.isSaveTransfers.next(true);
    this.transferService.save(transfer).then(value => {
      this.transfers.value.unshift(value);
    }).catch(reason => {
      this.messageService.showMobileInfoMessage(reason && reason.message ? reason.message : reason.toString(),
        2000, 'bottom');
    }).finally(() => {
      this.isSaveTransfers.next(false);
    });
  }
}

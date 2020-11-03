import {StockModel} from './stock.model';

export interface TransferModel {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
  date?: any;
  note?: string;
  from_shop?: {
    name: string;
    id: string;
    appId: string;
  };
  to_shop?: {
    name: string;
    id: string;
    appId: string;
  };
  transferred_by?: {
    name: string;
  };
  amount?: number;
  items?: StockModel[];
}

import {ExpenseItemModel} from './expense-item.model';

export interface ExpenseModel {
  createdAt?: any;
  updatedAt?: any;
  id?: string;
  _id?: string;
  amount?: number;
  item?: ExpenseItemModel;
  date?: string;
}

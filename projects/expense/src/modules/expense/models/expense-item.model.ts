import {MetasModel} from './metas.model';

export interface ExpenseItemModel {
  createdAt?: any;
  updatedAt?: any;
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  category?: string;
  metas?: MetasModel;
}

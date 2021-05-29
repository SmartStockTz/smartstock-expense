import {MetasModel} from './metas.model';

export interface StoreModel {
  createdAt?: any;
  updatedAt?: any;
  image?: any;
  id?: string;
  _id?: string;
  tag: string;
  description?: string;
  category?: string;
  quantity?: number;
  metas?: MetasModel;
  date?: string;
}

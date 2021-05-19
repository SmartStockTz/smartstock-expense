import {MetasModel} from './metas.model';

export interface StockModel {
  quantityIn: number;
  storeOut: StockModel[];
  createdAt?: any;
  catalog?: any[];
  updatedAt?: any;
  image?: any;
  id?: string;
  _id?: string;
  product: string;
  barcode?: string;
  saleable?: boolean | true;
  canExpire?: boolean | true;
  description?: string;
  unit?: string;
  category?: string;
  type?: 'simple' | 'grouped';
  downloadable?: boolean | false;
  downloads?: { name: string, type: string, url: any }[];
  stockable?: boolean | true;
  purchasable?: boolean | true;
  quantity?: number;
  wholesaleQuantity?: number;
  reorder?: number;
  purchase?: number;
  retailPrice?: number;
  wholesalePrice?: any;
  supplier?: string;
  expire?: string;
  metas?: MetasModel;
}

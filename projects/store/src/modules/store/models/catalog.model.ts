export interface CatalogModel {
  id?: string;
  _id?: string;
  name?: string;
  image?: string;
  child?: boolean;
  description?: string;
  createdAt?: any;
  updatedAt?: any;
  metas?: { [key: string]: any };
  parents?: CatalogModel[];
}

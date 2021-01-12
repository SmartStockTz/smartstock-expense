export interface CategoryModel {
  id?: string;
  name: string;
  description?: string;
  createdAt?: any;
  updatedAt?: any;
  metas?: { [key: string]: any };
  image?: string;
}

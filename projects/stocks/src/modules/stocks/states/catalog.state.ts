import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CatalogModel} from '../models/catalog.model';

@Injectable({
  providedIn: 'any'
})
export class CatalogState {
  selectedForEdit: BehaviorSubject<CatalogModel> = new BehaviorSubject<CatalogModel>(null);
}

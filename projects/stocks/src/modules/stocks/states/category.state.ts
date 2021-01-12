import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CategoryModel} from '../models/category.model';

@Injectable({
  providedIn: 'any'
})
export class CategoryState {
  selectedForEdit: BehaviorSubject<CategoryModel> = new BehaviorSubject<CategoryModel>(null);
}

import {Injectable} from '@angular/core';
import {ConfigsService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseNavigationService {
  constructor(private readonly configs: ConfigsService) {
  }

  init(): void {
    this.configs.addMenu({
      name: 'Expense',
      link: '/expense',
      icon: 'receipt',
      roles: ['admin', 'manager'],
      pages: [
        {
          name: 'items',
          link: '/expense/item',
          roles: ['admin', 'manager'],
          click: null
        },
        {
          name: 'add item',
          link: '/expense/item/in',
          roles: ['admin', 'manager'],
          click: null
        },
        {
          name: 'add expenses',
          link: '/expense/item/out',
          roles: ['admin', 'manager'],
          click: null
        },
        {
          name: 'categories',
          link: '/expense/categories',
          roles: ['admin', 'manager'],
          click: null
        },
        {
          name: 'report',
          link: '/expense/report',
          roles: ['admin', 'manager'],
          click: null
        }
      ]
    });
  }

  selected(): void {
    this.configs.selectedModuleName = 'Expense';
  }
}

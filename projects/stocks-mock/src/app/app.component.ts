import {Component, OnInit} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private readonly storageService: StorageService) {
  }

  async ngOnInit(): Promise<void> {
    BFast.init({
      applicationId: 'YQDG4Qm3j9vW',
      projectId: '0UTYLQKeifrk'
    }, '0UTYLQKeifrk');
    await this.storageService.saveCurrentProjectId('0UTYLQKeifrk');
    await this.storageService.saveActiveShop({
      applicationId: 'YQDG4Qm3j9vW',
      projectId: '0UTYLQKeifrk',
      businessName: 'smartstock',
      category: 'test',
      country: 'tz',
      projectUrlId: '0UTYLQKeifrk-daas',
      region: 'dar es salaam',
      settings: {
        allowRetail: true,
        allowWholesale: true,
        printerFooter: '',
        printerHeader: '',
        saleWithoutPrinter: true
      },
      street: 'sayansi',
    });
    await BFast.auth().setCurrentUser({
      id: 12,
      firstname: 'joshua',
      lastname: 'mshana',
      email: 'joshua@joshua.com',
      applicationId: 'YQDG4Qm3j9vW',
      projectId: '0UTYLQKeifrk',
      businessName: 'smartstock',
      category: 'test',
      country: 'tz',
      projectUrlId: '0UTYLQKeifrk-daas',
      region: 'dar es salaam',
      settings: {
        allowRetail: true,
        allowWholesale: true,
        printerFooter: '',
        printerHeader: '',
        saleWithoutPrinter: true
      },
      street: 'sayansi',
      shops: []
    });
  }

}

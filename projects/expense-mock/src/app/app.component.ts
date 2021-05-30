import {Component, OnInit} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  constructor(private readonly storageService: StorageService) {
  }

  async ngOnInit(): Promise<void> {
  }

}

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
  }

}

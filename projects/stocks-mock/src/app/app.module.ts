import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StockModule} from '../../../stocks/src/public-api';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BFast} from 'bfastjs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {StorageService} from '@smartstocktz/core-libs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    StockModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    BFast.init({
      applicationId: 'smartstock_lb',
      projectId: 'smartstock',
      appPassword: 'ZMUGVn72o3yd8kSbMGhfWpI80N9nA2IHjxWKlAhG'
    });
  }

}

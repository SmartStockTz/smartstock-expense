import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {StockModule} from '../../../stocks/src/public-api';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BFast} from 'bfastjs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule, Routes} from '@angular/router';
import {MatNativeDateModule} from '@angular/material/core';
import {WelcomePage} from './pages/welcome.page';
import {LoginPageComponent} from './pages/login.page';
import {AuthGuard} from './guards/auth.guard';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const routes: Routes = [
  {path: '', component: WelcomePage},
  {path: 'login', component: LoginPageComponent},
  {
    path: 'stock',
    canActivate: [AuthGuard],
    loadChildren: () => import('../../../stocks/src/public-api').then(mod => mod.StockModule)
  },
  // {
  //   path: 'account/shop',
  //   component: ''
  // }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomePage,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    StockModule,
    HttpClientModule,
    MatSnackBarModule,
    RouterModule,
    MatNativeDateModule,
    HammerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
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

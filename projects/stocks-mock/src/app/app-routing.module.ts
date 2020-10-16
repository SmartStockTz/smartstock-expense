import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'stock', loadChildren: () => import('../../../stocks/src/public-api').then(mod => mod.StockModule)
  },
  // {
  //   path: 'account/shop',
  //   component: ''
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

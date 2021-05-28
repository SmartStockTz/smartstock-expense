import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {StorageService} from '@smartstocktz/core-libs';
import {NoStockDialogComponent} from '@smartstocktz/core-libs';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ExistsGuard implements CanActivate {
  constructor(private readonly storageService: StorageService,
              private readonly userService: UserService,
              private readonly dialog: MatDialog) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      // try {
      //   const user = await this.userService.currentUser();
      //   if (user.role === 'user') {
      //     resolve(true);
      //   } else if (stocks && Array.isArray(stocks) && stocks.length > 0) {
      //     resolve(true);
      //   } else {
      //     this.dialog.open(NoStockDialogComponent).afterClosed();
      //     resolve(false);
      //   }
      // } catch (e) {
      //  // console.log(e);
      //   resolve(false);
      // }
      resolve(true);
    });
  }
}

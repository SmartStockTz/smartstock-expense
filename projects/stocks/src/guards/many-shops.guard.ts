import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MessageService, UserService} from '@smartstocktz/core-libs';

@Injectable({
  providedIn: 'root'
})
export class ManyShopsGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly message: MessageService,
              private readonly router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      const user = await this.userService.currentUser();
      const shops = await this.userService.getShops(user as any);
      if (shops.length > 1) {
        resolve(true);
      } else {
        this.message.showMobileInfoMessage(
          'Stock transfer require more than one shop, current you have one shop',
          4000,
          'bottom');
        this.router.navigateByUrl('/stock').catch();
        resolve(false);
      }
    });
  }

}

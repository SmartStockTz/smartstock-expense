import {Component, OnInit} from '@angular/core';
import {DeviceInfoUtil} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-store-out',
  template: `
    <app-layout-sidenav [heading]="'Store Out'"
                        [leftDrawer]="side"
                        backLink="/store"
                        [hasBackRoute]="true"
                        #sidenav
                        [body]="body"
                        [leftDrawerMode]="enoughWidth()?'side':'over'"
                        [leftDrawerOpened]="enoughWidth()">
      <ng-template #side>
        <app-drawer></app-drawer>
      </ng-template>
      <ng-template #body>
        <div class="col-12 col-xl-9 col-lg-9 col-md-10 col-sm-11 mx-auto" style="min-height: 100vh">
          <app-store-out-component></app-store-out-component>
        </div>
      </ng-template>
    </app-layout-sidenav>
  `,
  styleUrls: ['../styles/create.style.scss']
})
export class StoreOutPage extends DeviceInfoUtil implements OnInit {
  constructor() {
    super();
    document.title = 'SmartStock - Store Out';
  }

  ngOnInit(): void {
  }

}

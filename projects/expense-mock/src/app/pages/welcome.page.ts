import {Component} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <h1>Welcome to Expense Mock</h1>
    <a routerLink="/expense">Start Now</a>
  `
})

export class WelcomePage {

}

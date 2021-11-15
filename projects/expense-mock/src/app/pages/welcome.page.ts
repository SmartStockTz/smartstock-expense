import {Component} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column">
      <h1>Welcome to Expense Mock</h1>
      <a routerLink="/expense">Start Now</a>
    </div>
  `
})

export class WelcomePage {

}

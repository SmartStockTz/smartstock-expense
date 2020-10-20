import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BFast} from 'bfastjs';
import {Router} from '@angular/router';
import {StorageService} from '@smartstocktz/core-libs';

@Component({
  selector: 'app-login',
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column">
      <mat-card>
        <mat-card-content>
          <form [formGroup]="loginForm" (submit)="login()" style="display: flex; flex-direction: column">
            <mat-form-field style="width: 300px">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username">
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <mat-form-field style="width: 300px">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password">
              <mat-error>Field required</mat-error>
            </mat-form-field>
            <button *ngIf="!isLogin" mat-flat-button color="primary">Login</button>
            <mat-progress-spinner color="primary" mode="indeterminate" diameter="30" *ngIf="isLogin"></mat-progress-spinner>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  isLogin = false;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly storageService: StorageService,
              private readonly snack: MatSnackBar) {
  }

  login(): void {
    if (!this.loginForm.valid) {
      this.snack.open('Please fill all required fields', 'Ok', {duration: 3000});
    } else {
      this.isLogin = true;
      BFast.auth().logIn(this.loginForm.value.username, this.loginForm.value.password)
        .then(async user => {
          this.router.navigateByUrl('/stock').catch(console.log);
          BFast.init({
            applicationId: user.applicationId,
            projectId: user.projectId
          }, user.projectId);
          await this.storageService.saveCurrentProjectId('0UTYLQKeifrk');
          await this.storageService.saveActiveShop(user as any);
        })
        .catch(reason => {
          this.snack.open(reason && reason.message ? reason.message : reason, 'Ok');
        }).finally(() => {
          this.isLogin = false;
      });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.nullValidator, Validators.required]],
      password: ['', [Validators.nullValidator, Validators.required]],
    });
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-store-generated-form-field',
  template: `
    <div [formGroup]="formGroup">
      <div [ngSwitch]="type" formGroupName="metas">
        <mat-form-field *ngSwitchCase="'string'" appearance="outline" class="my-input">
          <mat-label>{{label}}</mat-label>
          <input matInput formControlName="{{name}}" type="text">
          <mat-error>{{label}} required</mat-error>
        </mat-form-field>

        <mat-form-field *ngSwitchCase="'number'" appearance="outline" class="my-input">
          <mat-label>{{label}}</mat-label>
          <input matInput formControlName="{{name}}" type="number">
          <mat-error>{{label}} required</mat-error>
        </mat-form-field>

        <mat-form-field *ngSwitchCase="'textarea'" appearance="outline" class="my-input">
          <mat-label>{{label}}</mat-label>
          <textarea matInput formControlName="{{name}}" type="text"></textarea>
          <mat-error>{{label}} required</mat-error>
        </mat-form-field>

        <mat-form-field *ngSwitchCase="'date'" appearance="outline" class="my-input">
          <mat-label>{{label}}</mat-label>
          <input matInput [matDatepicker]="datepicker" formControlName="{{name}}">
          <mat-datepicker #datepicker></mat-datepicker>
          <mat-datepicker-toggle matSuffix [for]="datepicker"></mat-datepicker-toggle>
          <mat-error>{{label}} required</mat-error>
        </mat-form-field>

        <mat-form-field *ngSwitchCase="'array'" appearance="outline" class="my-input">
          <mat-label>{{label}}</mat-label>
          <mat-select formControlName="{{name}}" multiple>
            <mat-option *ngFor="let option of selectOptions | async" [value]="option">
              {{option}}
            </mat-option>
          </mat-select>
          <mat-progress-spinner matTooltip="Fetching {{label}}"
                                *ngIf="!selectOptions" matSuffix color="accent"
                                mode="indeterminate"
                                [diameter]="20"></mat-progress-spinner>
          <mat-error>{{label}} required</mat-error>
        </mat-form-field>

      </div>
    </div>
  `
})

export class GeneratedFormFieldComponent implements OnInit {
  @Input() type: string;
  @Input() label: string;
  @Input() name: string;
  @Input() selectOptions: Observable<any[]>;
  @Input() formGroup: UntypedFormGroup;

  constructor() {
  }

  ngOnInit(): void {
  }
}

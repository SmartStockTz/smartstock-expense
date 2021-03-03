import {Component, Input} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {MetasModel} from '../models/metas.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-stock-metas-form-field',
  template: `
    <mat-card [formGroup]="formGroup" class="{{flat?'mat-elevation-z0':''}}">
      <mat-card-content formGroupName="metas">
        <div *ngFor="let i = index; let meta of metas | async">
          <div style="display: flex; flex-wrap: nowrap">
            <app-stock-generated-form-field [label]="meta.name"
                                                   [formGroup]="formGroup"
                                                   [name]="meta.name"
                                                   style="flex-grow: 1"
                                                   [type]="meta.type">
            </app-stock-generated-form-field>
            <button (click)="removeAttributeToMeta($event, i, meta.value)" mat-icon-button>
              <mat-icon color="warn">delete</mat-icon>
            </button>
          </div>
        </div>

        <mat-divider></mat-divider>
        <div style="margin-top: 16px">
          <mat-form-field appearance="outline" style="margin: 5px">
            <mat-label>Type</mat-label>
            <mat-select [formControl]="addMetaTypeFormControl" required>
              <mat-option value="string">Text</mat-option>
              <mat-option value="textarea">TextArea</mat-option>
              <mat-option value="number">Number</mat-option>
              <mat-option value="date">Date</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" style="margin: 5px">
            <mat-label>Name</mat-label>
            <input matInput type="text" [formControl]="addMetaNameFormControl">
          </mat-form-field>
          <button style="margin: 5px"
                  [disabled]="!addMetaNameFormControl.valid || !addMetaTypeFormControl.valid"
                  matTooltip="'Add product attribute'" (click)="addAttributeToMeta($event)"
                  mat-button
                  color="primary">
            Add Field
          </button>
        </div>

      </mat-card-content>
    </mat-card>
  `
})

export class MetasFormFieldComponent {
  @Input() formGroup;
  @Input() metas: BehaviorSubject<MetasModel[]>;
  addMetaTypeFormControl = new FormControl('text', [Validators.nullValidator, Validators.required]);
  addMetaNameFormControl = new FormControl('', [Validators.nullValidator, Validators.required]);
  @Input() flat = false;

  constructor(private readonly formBuilder: FormBuilder) {
  }

  addAttributeToMeta($event): void {
    $event.preventDefault();
    (this.formGroup.get('metas') as FormGroup).addControl(
      this.addMetaNameFormControl.value,
      this.formBuilder.control(null, [Validators.nullValidator, Validators.required])
    );
    this.metas.value.push({
      name: this.addMetaNameFormControl.value,
      type: this.addMetaTypeFormControl.value,
      value: this.addMetaNameFormControl.value
    });
    this.metas.next(this.metas.value);
    this.addMetaNameFormControl.reset();
    this.addMetaTypeFormControl.reset();
  }

  removeAttributeToMeta($event, index, name): void {
    $event.preventDefault();
    this.metas.next(this.metas.value.filter(value => value.name !== name));
    (this.formGroup.get('metas') as FormGroup).removeControl(name);
  }


}

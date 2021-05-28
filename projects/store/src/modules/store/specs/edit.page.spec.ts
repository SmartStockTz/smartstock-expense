import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreEditComponent } from './store-edit.component';

describe('EditPage', () => {
  let component: StoreEditComponent;
  let fixture: ComponentFixture<StoreEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

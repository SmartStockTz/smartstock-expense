import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StockEditComponent } from './stock-edit.component';

describe('EditPage', () => {
  let component: StockEditComponent;
  let fixture: ComponentFixture<StockEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StockEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

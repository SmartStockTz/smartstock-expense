import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksMockComponent } from './stocks-mock.component';

describe('StocksMockComponent', () => {
  let component: StocksMockComponent;
  let fixture: ComponentFixture<StocksMockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksMockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

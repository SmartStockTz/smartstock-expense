import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadProductsComponent } from './upload-products.component';

describe('ImportsComponent', () => {
  let component: UploadProductsComponent;
  let fixture: ComponentFixture<UploadProductsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

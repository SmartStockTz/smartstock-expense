import { TestBed } from '@angular/core/testing';

import { StocksMockService } from './stocks-mock.service';

describe('StocksMockService', () => {
  let service: StocksMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocksMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

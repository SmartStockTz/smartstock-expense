import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { ExistsGuard } from '../guards/exists.guard';

describe('StoreExistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExistsGuard]
    });
  });

  it('should ...', inject([ExistsGuard], (guard: ExistsGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { FirestoreApiService } from './firestore-api.service';

describe('FirestoreApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreApiService = TestBed.get(FirestoreApiService);
    expect(service).toBeTruthy();
  });
});

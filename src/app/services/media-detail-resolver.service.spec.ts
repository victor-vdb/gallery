import { TestBed, inject } from '@angular/core/testing';

import { MediaDetailResolverService } from './media-detail-resolver.service';

describe('MediaDetailResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaDetailResolverService]
    });
  });

  it('should be created', inject([MediaDetailResolverService], (service: MediaDetailResolverService) => {
    expect(service).toBeTruthy();
  }));
});

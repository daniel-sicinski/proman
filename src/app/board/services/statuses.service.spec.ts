import { TestBed } from "@angular/core/testing";

import { StatusesService } from "./statuses.service";

xdescribe("StatusesService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: StatusesService = TestBed.get(StatusesService);
    expect(service).toBeTruthy();
  });
});

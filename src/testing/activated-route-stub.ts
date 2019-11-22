import { ReplaySubject } from "rxjs";

import { ParamMap, Params, convertToParamMap } from "@angular/router";

export class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  readonly paramMap = this.subject.asObservable();

  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params as Params));
  }
}

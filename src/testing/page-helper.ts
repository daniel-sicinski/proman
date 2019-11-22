import { ComponentFixture } from "@angular/core/testing";

export abstract class PageHelper<T> {
  constructor(public fixture: ComponentFixture<T>) {}

  protected query<E>(selector: string): E {
    return this.fixture.nativeElement.querySelector(selector);
  }

  protected queryAll<E>(selector: string): E[] {
    return this.fixture.nativeElement.querySelectorAll(selector);
  }
}

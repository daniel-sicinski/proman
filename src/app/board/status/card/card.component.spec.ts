import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { click } from "@testing/testing-helpers";

import { CardComponent } from "./card.component";
import { PageHelper } from "@testing/page-helper";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import {
  Component,
  NO_ERRORS_SCHEMA,
  Output,
  EventEmitter
} from "@angular/core";
import { By } from "@angular/platform-browser";

@Component({ selector: "app-card-edit", template: "" })
class CardEditComponent {
  @Output() closeEditState = new EventEmitter<void>();
}

const currentCard = {
  description: "TestCard",
  order: 1,
  id: "1"
};

describe("CardComponent", () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let page: Page;
  let f: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, SharedModule],
      declarations: [CardComponent, CardEditComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    component.currentCard = currentCard;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("clicking on the card edit button triggers edit state", () => {
    component.editStateChange.subscribe((value: boolean) => {
      expect(value).toBeTruthy();
    });

    click(page.editCardButton);

    expect(component.cardEditState).toBeTruthy();
  });

  it("calling closeCardEditState closes edit state", () => {
    component.editStateChange.subscribe((value: boolean) => {
      expect(value).toBeFalsy();
    });

    component.closeCardEditState();

    expect(component.cardEditState).toBeFalsy();
  });
});

class Page extends PageHelper<CardComponent> {
  get editCardButton() {
    return this.query<HTMLButtonElement>(".test-card-tile__edit-btn");
  }

  constructor(public fixture: ComponentFixture<CardComponent>) {
    super(fixture);
  }
}

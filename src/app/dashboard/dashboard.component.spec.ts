import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardComponent } from "./dashboard.component";
import { FormBuilder } from "@angular/forms";
import { AuthService } from "../core/services/auth.service";
import { BoardsService } from "../core/services/boards.service";
import { DebugElement } from "@angular/core";
import { Board } from "./models/Board";
import { DashboardModule } from "./dashboard.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  click,
  dispatchInputEvent,
  dispatchSubmitEvent
} from "@testing/testing-helpers";
import { PageHelper } from "@testing/page-helper";

class BoardServiceMock {
  boardsSubject = new Subject<Board[]>();
  userBoards$ = this.boardsSubject.asObservable();

  addBoard = jasmine.createSpy("addBoardSpy");
}

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let de: DebugElement;
  let authService: jasmine.SpyObj<AuthService>;
  let boardService: BoardServiceMock;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DashboardModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj<AuthService>("AuthService", ["logOut"])
        },
        {
          provide: BoardsService,
          useValue: new BoardServiceMock()
        },
        FormBuilder
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    authService = TestBed.get(AuthService);
    boardService = TestBed.get(BoardsService);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display user boards", () => {
    const dummyBoards = [
      userFactory("title1", "1", "1"),
      userFactory("title2", "1", "2")
    ];

    boardService.boardsSubject.next(dummyBoards);

    // update view
    fixture.detectChanges();

    expect(page.boardLinks.length).toBe(2);
  });

  it("calling onLogOut() should call logOut() method from AuthService", () => {
    component.onLogOut();

    expect(authService.logOut).toHaveBeenCalledTimes(1);
  });

  describe("Adding new dashboard", () => {
    it("displays form modal on btn click", () => {
      click(page.addDashboardBtn);

      fixture.detectChanges();

      expect(page.newBoardModal).toBeDefined();
      expect(page.newBoardModal).not.toBeNull();
    });
  });

  it("submitting a new dashboard title calls addBoard() from BoardService", () => {
    const newBoardTitle = "test";

    component.addBoardModalOpened = true;

    fixture.detectChanges();

    page.newBoardInput.value = newBoardTitle;
    dispatchInputEvent(page.newBoardInput);

    dispatchSubmitEvent(page.newBoardForm);

    expect(boardService.addBoard).toHaveBeenCalledTimes(1);
    expect(boardService.addBoard).toHaveBeenCalledWith(newBoardTitle);
  });

  it("After adding new dashboard modal is closed and the form resets", () => {
    component.onNewBoardSubmit();

    fixture.detectChanges();

    expect(page.newBoardModal).toBeNull();
    expect(component.newBoardForm.value.title).toBeNull();
  });
});

function userFactory(title: string, userId: string, boardId: string) {
  return {
    title,
    userId,
    boardId
  };
}

class Page extends PageHelper<DashboardComponent> {
  get addDashboardBtn() {
    return this.query<HTMLButtonElement>(".test-add-board-btn");
  }
  get boardLinks() {
    return this.queryAll<HTMLElement>(".test-board-link");
  }

  get newBoardModal() {
    return this.query<HTMLDivElement>(".test-new-board-modal");
  }

  get newBoardForm() {
    return this.query<HTMLFormElement>("form");
  }

  get newBoardInput() {
    return this.query<HTMLInputElement>("form input");
  }

  constructor(public fixture: ComponentFixture<DashboardComponent>) {
    super(fixture);
  }
}

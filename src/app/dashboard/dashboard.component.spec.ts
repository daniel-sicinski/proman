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
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

class BoardServiceMock {
  boardsSubject = new Subject<Board[]>();
  userBoards$ = this.boardsSubject.asObservable();

  addBoard = jasmine.createSpy("addBoardSpy");
}

fdescribe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let de: DebugElement;
  let authService: jasmine.SpyObj<AuthService>;
  let boardService: BoardServiceMock;

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
    de = fixture.debugElement;

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

    const boardLinks = de.queryAll(By.css(".test-board-link"));

    expect(boardLinks.length).toBe(2);
  });

  it("calling onLogOut() should call logOut() method from AuthService", () => {
    component.onLogOut();

    expect(authService.logOut).toHaveBeenCalledTimes(1);
  });

  describe("Adding new dashboard", () => {
    it("displays form modal on btn click", () => {
      const button = de.query(By.css(".test-add-board-btn"))
        .nativeElement as HTMLButtonElement;

      button.dispatchEvent(newEvent("click"));

      fixture.detectChanges();

      const newBoardModal = de.query(By.css(".test-new-board-modal"));

      expect(newBoardModal).toBeDefined();
      expect(newBoardModal).not.toBeNull();
    });
  });

  it("submitting a new dashboard title calls addBoard() from BoardService", () => {
    const newBoardTitle = "test";

    component.addBoardModalOpened = true;

    fixture.detectChanges();

    const formInput = de.query(By.css("form input"))
      .nativeElement as HTMLInputElement;
    formInput.value = newBoardTitle;
    formInput.dispatchEvent(newEvent("input"));

    const formElement = de.query(By.css("form"))
      .nativeElement as HTMLFormElement;
    formElement.dispatchEvent(newEvent("submit"));

    expect(boardService.addBoard).toHaveBeenCalledTimes(1);
    expect(boardService.addBoard).toHaveBeenCalledWith(newBoardTitle);
  });

  it("After adding new dashboard modal is closed and the form resets", () => {
    component.onNewBoardSubmit();

    fixture.detectChanges();

    const newBoardModal = de.query(By.css(".test-new-board-modal"));

    expect(newBoardModal).toBeNull();
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

function newEvent(eventName: string) {
  return new Event(eventName);
}

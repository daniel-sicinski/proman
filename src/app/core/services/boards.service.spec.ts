import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { BoardsService } from "./boards.service";
import { AuthService } from "./auth.service";
import { AngularFirestore, QueryFn } from "@angular/fire/firestore";
import { Subject, of, Subscription } from "rxjs";
import { User } from "firebase";

const dummyBoards = [{ title: "title", userId: "1", boardId: "xyz" }];

class AuthServiceMock {
  user: User = { uid: "1" } as User;
  usersSubject = new Subject<User | null>();

  user$ = this.usersSubject.asObservable();

  logIn({  }: { email: string; password: string }) {
    this.usersSubject.next(this.user);
  }

  logOut() {
    this.usersSubject.next(null);
  }
}

class AngularFirestoreMock {
  collection(path: string, queryFn?: QueryFn) {
    return {
      valueChanges: () => of(dummyBoards)
    };
  }
}

describe("BoardsService", () => {
  let boardService: BoardsService;
  let authService: AuthService;
  let userBoardsSubscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AngularFirestore, useValue: new AngularFirestoreMock() },
        BoardsService
      ]
    });

    boardService = TestBed.get(BoardsService);
    authService = TestBed.get(AuthService);
  });

  afterEach(() => {
    if (userBoardsSubscription) {
      userBoardsSubscription.unsubscribe();
    }
  });

  it("should be created", () => {
    const service: BoardsService = TestBed.get(BoardsService);
    expect(service).toBeTruthy();
  });

  it("userBoards$ should return observable with boards if user is authenticated", fakeAsync(() => {
    authService.logIn({ email: "", password: "" });

    tick();

    userBoardsSubscription = boardService.userBoards$.subscribe(boards => {
      expect(boards).toEqual(dummyBoards);
    });
  }));

  it("userBoards$ should be undefined if user is not authenticated", fakeAsync(() => {
    authService.logOut();

    tick();

    expect(boardService.userBoards$).toBeUndefined();
  }));
});

import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import {
  AngularFirestoreModule,
  AngularFirestore,
  QueryFn
} from "@angular/fire/firestore";
import { AngularFireAuthModule, AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { bufferCount, skip } from "rxjs/operators";
import { SharedModule } from "src/app/shared/shared.module";

type SpyObj<T> = jasmine.SpyObj<T>;

class AngularFirestoreMock {
  collection(path: string, queryFn?: QueryFn) {
    return {
      doc: (id: string) => {
        return {
          set: (data: any) => new Promise(res => res())
        };
      }
    };
  }
}

describe("AuthService", () => {
  let router: SpyObj<Router>;
  let authService: AuthService;
  let afAuth: AngularFireAuth;
  let fs: AngularFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        SharedModule
      ],
      providers: [
        AngularFireAuth,
        // AngularFirestore,
        {
          provide: AngularFirestore,
          useValue: new AngularFirestoreMock()
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj("Router", ["navigate"])
        },
        AuthService
      ]
    });

    router = TestBed.get(Router);
    authService = TestBed.get(AuthService);
    afAuth = TestBed.get(AngularFireAuth);
    fs = TestBed.get(AngularFirestore);
  });

  it("should be created", () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  xit("sets public properties", () => {
    expect(authService.user$).toBe(afAuth.user);
    expect(authService.authErrorMessage$).toEqual(
      new Observable<string | null>()
    );
    expect(authService.fetchingAuthData$).toEqual(new Observable<boolean>());
  });

  describe("logout()", () => {
    it("navigates user to login route", fakeAsync(() => {
      const signOutSpy = spyOn(afAuth.auth, "signOut").and.returnValue(
        new Promise(res => res())
      );

      authService.logOut();
      tick();

      expect(signOutSpy).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(["/auth", "logIn"]);
    }));

    it("changes fetching state", done => {
      spyOn(afAuth.auth, "signOut").and.returnValue(new Promise(res => res()));

      authService.fetchingAuthData$
        .pipe(bufferCount(3))
        .subscribe(([v1, v2, v3]) => {
          expect(v1).toBe(false);
          expect(v2).toBe(true);
          expect(v3).toBe(false);
          done();
        });

      authService.logOut();
    });
  });

  describe("logIn()", () => {
    const authData = { email: "mail@mail.com", password: "123" };

    it("signsup with provided email and password", fakeAsync(() => {
      const signInSpy = spyOn(
        afAuth.auth,
        "signInWithEmailAndPassword"
      ).and.returnValue(new Promise(res => res()));

      authService.logIn(authData);
      tick();

      expect(signInSpy).toHaveBeenCalledWith("mail@mail.com", "123");
    }));

    it("after successful login navigates to dashboard", fakeAsync(() => {
      spyOn(afAuth.auth, "signInWithEmailAndPassword").and.returnValue(
        new Promise(res => res())
      );

      authService.logIn(authData);
      tick();

      expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
    }));

    it("after unsuccessful login returns error message", done => {
      const error = new Error("Error message");

      spyOn(afAuth.auth, "signInWithEmailAndPassword").and.returnValue(
        new Promise((res, rej) => rej(error))
      );

      authService.authErrorMessage$.pipe(skip(1)).subscribe(message => {
        expect(message).toBe(error.message);
        done();
      });

      authService.logIn(authData);
    });
  });

  describe("signUp()", () => {
    const authData = { email: "mail@mail.com", password: "123", name: "John" };

    it("signsup with provided email and password", fakeAsync(() => {
      const signUpSpy = spyOn(
        afAuth.auth,
        "createUserWithEmailAndPassword"
      ).and.returnValue(
        new Promise(res => res()).then(() => new Promise(res => res()))
      );

      authService.signUp(authData);
      tick();

      expect(signUpSpy).toHaveBeenCalledWith("mail@mail.com", "123");
    }));

    xit("after successful signn navigates to dashboard", fakeAsync(() => {
      spyOn(afAuth.auth, "createUserWithEmailAndPassword").and.returnValue(
        new Promise(res => res())
      );

      authService.signUp(authData);
      tick();

      expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
    }));

    xit("after unsuccessful login returns error message", done => {
      const error = new Error("Error message");

      spyOn(afAuth.auth, "signInWithEmailAndPassword").and.returnValue(
        new Promise((res, rej) => rej(error))
      );

      authService.authErrorMessage$.pipe(skip(1)).subscribe(message => {
        expect(message).toBe(error.message);
        done();
      });

      authService.logIn(authData);
    });
  });
});

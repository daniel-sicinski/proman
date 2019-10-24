import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

interface AuthData {
  email: string;
  password: string;
  name?: string;
}

interface User {
  name: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<User>;
  private readonly authErrorMessageSubject = new BehaviorSubject<string | null>(
    null
  );
  private readonly fetchingAuthData = new BehaviorSubject<boolean>(false);

  user$ = this.afAuth.user;
  authErrorMessage$ = this.authErrorMessageSubject.asObservable();
  fetchingAuthData$ = this.fetchingAuthData.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.usersCollection = this.afs.collection<User>("users");
  }

  signUp(authData: AuthData): void {
    const { email, password, name } = authData;

    this.fetchingAuthData.next(true);
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const uid = userCredential.user!.uid;

        return this.usersCollection.doc(uid).set({ name });
      })
      .then(() => {
        this.fetchingAuthData.next(false);
        this.router.navigate(["/dashboard"]);
      })
      .catch(err => {
        this.fetchingAuthData.next(false);
        this.authErrorMessageSubject.next(err.message);
      });
  }

  logIn(authData: AuthData) {
    const { email, password } = authData;

    this.fetchingAuthData.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.fetchingAuthData.next(false);
        this.router.navigate(["/dashboard"]);
      })
      .catch(err => {
        this.fetchingAuthData.next(false);
        this.authErrorMessageSubject.next(err.message);
      });
  }

  logOut() {
    this.fetchingAuthData.next(true);
    this.afAuth.auth.signOut().then(() => {
      this.fetchingAuthData.next(false);
      this.router.navigate(["/auth", "logIn"]);
    });
  }
}

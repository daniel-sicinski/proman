import { Component, OnInit } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, exhaustMap } from "rxjs/operators";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { User } from "firebase";
import { BoardsService, Board } from "./boards.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  // currentUserId: string;
  // userSub: Subscription;
  // currentUserDoc: AngularFirestoreDocument<User>;
  userBoards$: Observable<Board[]>;

  constructor(
    private readonly authService: AuthService,
    private readonly afs: AngularFirestore,
    private readonly boardsService: BoardsService
  ) {}

  ngOnInit() {
    // this.authService.user$.pipe(take(1)).subscribe(userSnapshot => {
    //   this.currentUserDoc = this.afs.doc<User>(`users/${userSnapshot!.uid}`);
    //   this.currentUserId = userSnapshot!.uid;

    // });
    this.userBoards$ = this.boardsService.userBoards$;
  }

  onLogOut() {
    this.authService.logOut();
  }
}

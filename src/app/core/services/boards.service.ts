import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Subscription, Observable } from "rxjs";
import { Board } from "src/app/dashboard/models/Board";

@Injectable({ providedIn: "root" })
export class BoardsService implements OnDestroy {
  private userBoardsCollection: AngularFirestoreCollection<Board>;
  private currentUserId: string;

  userBoards$: Observable<Board[]>;

  private userSnapshotSub: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    // Put in constructor, because the code does not work in ngOnInit
    this.userSnapshotSub = this.authService.user$.subscribe(userSnapshot => {
      if (userSnapshot) {
        this.initializeDashboard(userSnapshot);
      }
    });
  }

  ngOnDestroy() {
    this.userSnapshotSub.unsubscribe();
  }

  addBoard(title: string): void {
    this.userBoardsCollection.add({ title, userId: this.currentUserId });
  }

  updateBoard(boardId: string, newBoard: Board): void {
    this.userBoardsCollection.doc(boardId).set(newBoard);
  }

  deleteBoard(boardId: string): void {
    this.userBoardsCollection.doc(boardId).delete();
  }

  private initializeDashboard(userSnapshot: firebase.User | null): void {
    this.currentUserId = userSnapshot!.uid;

    this.userBoardsCollection = this.afs.collection<Board>(`boards`, ref =>
      ref.where("userId", "==", userSnapshot!.uid)
    );

    this.userBoards$ = this.userBoardsCollection.valueChanges({
      idField: "boardId"
    });
  }
}

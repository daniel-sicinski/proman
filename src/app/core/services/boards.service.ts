import { Injectable, OnDestroy } from "@angular/core";
import { AuthService } from "./auth.service";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Subscription, Observable } from "rxjs";

export interface Board {
  title: string;
  userId: string;
  boardId?: string;
}

@Injectable({ providedIn: "root" })
export class BoardsService implements OnDestroy {
  private userBoardsCollection: AngularFirestoreCollection<Board>;
  userBoards$: Observable<Board[]>;
  currentUserId: string;

  userSnapshotSub: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    this.userSnapshotSub = this.authService.user$.subscribe(userSnapshot => {
      if (userSnapshot) {
        this.currentUserId = userSnapshot.uid;

        this.userBoardsCollection = this.afs.collection<Board>(`boards`, ref =>
          ref.where("userId", "==", userSnapshot.uid)
        );

        this.userBoards$ = this.userBoardsCollection.valueChanges({
          idField: "boardId"
        });
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
}

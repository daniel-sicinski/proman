import { Injectable, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Subscription, Observable } from "rxjs";

export interface Board {
  title: string;
}

@Injectable({
  providedIn: "root"
})
export class BoardsService implements OnDestroy {
  private userBoardsCollection: AngularFirestoreCollection<Board>;
  userBoards$: Observable<Board[]>;

  userSnapshotSub: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly afs: AngularFirestore
  ) {
    this.userSnapshotSub = this.authService.user$.subscribe(userSnapshot => {
      if (userSnapshot) {
        this.userBoardsCollection = this.afs.collection<Board>(
          `users/${userSnapshot.uid}/boards`
        );
        this.userBoards$ = this.userBoardsCollection.valueChanges();
      }
    });
  }

  ngOnDestroy() {
    this.userSnapshotSub.unsubscribe();
  }

  addBoard(title: string): void {
    this.userBoardsCollection.add({ title });
  }

  updateBoard(boardId: string, newBoard: Board): void {
    this.userBoardsCollection.doc(boardId).set(newBoard);
  }

  deleteBoard(boardId: string): void {
    this.userBoardsCollection.doc(boardId).delete();
  }
}

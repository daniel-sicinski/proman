import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";

export interface Status {
  name: string;
  order: number;
  statusId?: string;
}

@Injectable()
export class StatusesService {
  private boardStatusesCollection: AngularFirestoreCollection<Status>;
  boardStatuses$: Observable<Status[]>;
  boardId: string;

  constructor(private readonly afs: AngularFirestore) {}

  getStatusesOfBoard(boardId: string) {
    this.boardId = boardId;
    this.boardStatusesCollection = this.afs.collection<Status>(
      `boards/${boardId}/statuses`,
      ref => ref.orderBy("order", "asc")
    );
    this.boardStatuses$ = this.boardStatusesCollection
      .valueChanges({
        idField: "statusId"
      })
      .pipe(
        map(statuses => {
          return statuses.sort((st1, st2) => st1.order - st2.order);
        })
      );
  }

  addStatus(status: Status) {
    this.boardStatusesCollection.add(status);
  }

  updateStatus(statusId: string, status: Status) {}

  deleteStatus(status: Status) {
    console.log("delete start...");
    // this.boardStatusesCollection.doc(status.statusId).delete();

    const batch = this.afs.firestore.batch();
    batch.delete(this.boardStatusesCollection.doc(status.statusId).ref);

    this.afs
      .collection<Status>(`boards/${this.boardId}/statuses`, ref =>
        ref.where("order", ">", status.order)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions => actions.map(a => a.payload.doc.ref)),
        tap(references => {
          references.forEach(r =>
            batch.update(r, {
              order: firebase.firestore.FieldValue.increment(-1)
            })
          );
        })
      )
      .subscribe(() => {
        batch.commit().then(() => console.log("batch completed!"));
      });
  }
}

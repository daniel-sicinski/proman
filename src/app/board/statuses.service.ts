import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Status {
  name: string;
  order: number;
  statusId?: string;
}

@Injectable()
export class StatusesService {
  private boardStatusesCollection: AngularFirestoreCollection<Status>;
  boardStatuses$: Observable<Status[]>;

  constructor(private readonly afs: AngularFirestore) {}

  getStatusesOfBoard(boardId: string) {
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

  deleteStatus(statusId: string) {}
}

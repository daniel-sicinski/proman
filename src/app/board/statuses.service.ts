import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

export interface Status {
  name: string;
  statusId?: string;
}

@Injectable()
export class StatusesService {
  private boardStatusesCollection: AngularFirestoreCollection<Status>;
  boardStatuses$: Observable<Status[]>;

  constructor(private readonly afs: AngularFirestore) {}

  getStatusesOfBoard(boardId: string) {
    this.boardStatusesCollection = this.afs.collection<Status>(
      `boards/${boardId}/statuses`
    );
    this.boardStatuses$ = this.boardStatusesCollection.valueChanges({
      idField: "statusId"
    });
  }

  addStatus(name: string) {
    this.boardStatusesCollection.add({ name });
  }

  updateStatus(statusId: string, status: Status) {}

  deleteStatus(statusId: string) {}
}

import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Status } from "../models/Status";
import { FirestoreApiService } from "src/app/core/services/firestore-api.service";

@Injectable()
export class StatusesService {
  private boardStatusesCollectionRef: AngularFirestoreCollection<Status>;
  private boardStatuses: Status[] = [];

  boardStatuses$: Observable<Status[]>;

  constructor(
    private readonly afs: AngularFirestore,
    private firestoreApiService: FirestoreApiService
  ) {}

  getStatusesOfBoard(boardId: string): void {
    this.boardStatusesCollectionRef = this.afs.collection<Status>(
      `boards/${boardId}/statuses`
    );

    this.boardStatuses$ = this.boardStatusesCollectionRef
      .valueChanges({
        idField: "id"
      })
      .pipe(
        map(statuses => {
          const sortedStatuses = statuses.sort(
            (st1, st2) => st1.order - st2.order
          );
          this.boardStatuses = sortedStatuses;
          return sortedStatuses;
        })
      );
  }

  addStatus(status: Status): void {
    this.boardStatusesCollectionRef.add(status);
  }

  updateStatusName(statusId: string, name: string): void {
    this.boardStatusesCollectionRef.doc<Status>(statusId).update({ name });
  }

  updateStatusesOrder(statusesCollectionWithNewOrder: Status[]): void {
    const batch = this.afs.firestore.batch();

    this.firestoreApiService.updateOrderOfDocumentsInCollection<Status>(
      this.boardStatusesCollectionRef,
      statusesCollectionWithNewOrder,
      batch
    );
  }

  deleteStatus(statusToDelete: Status): void {
    const batch = this.afs.firestore.batch();
    batch.delete(this.boardStatusesCollectionRef.doc(statusToDelete.id).ref);

    const filteredOutStatuses = this.boardStatuses.filter(
      status => status !== statusToDelete
    );

    this.firestoreApiService.updateOrderOfDocumentsInCollection<Status>(
      this.boardStatusesCollectionRef,
      filteredOutStatuses,
      batch
    );
  }
}

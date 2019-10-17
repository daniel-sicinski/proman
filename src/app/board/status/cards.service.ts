import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import * as firebase from "firebase";

export interface Card {
  description: string;
  order: number;
  cardId?: string;
}

@Injectable()
export class CardsService {
  private statusCardsCollection: AngularFirestoreCollection<Card>;
  statusCards$: Observable<Card[]>;
  statusId: string | undefined;
  boardId: string;

  constructor(private readonly afs: AngularFirestore) {}

  getCardsForStatus(boardId: string, statusId: string | undefined) {
    this.statusId = statusId;
    this.boardId = boardId;

    this.statusCardsCollection = this.afs.collection<Card>(
      `boards/${boardId}/statuses/${statusId}/cards`,
      ref => ref.orderBy("order", "asc")
    );
    this.statusCards$ = this.statusCardsCollection
      .valueChanges({
        idField: "cardId"
      })
      .pipe(
        map(cards => {
          return cards.sort((c1, c2) => c1.order - c2.order);
        })
      );
  }

  addCard(card: Card) {
    this.statusCardsCollection.add(card);
  }

  updateStatus(cardId: string, card: Card) {}

  deleteCard(card: Card) {
    console.log("delete card start...");

    const batch = this.afs.firestore.batch();
    batch.delete(this.statusCardsCollection.doc(card.cardId).ref);

    this.afs
      .collection<Card>(
        `boards/${this.boardId}/statuses/${this.statusId}/cards`,
        ref => ref.where("order", ">", card.order)
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

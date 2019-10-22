import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import * as firebase from "firebase";
// import undefined = require("firebase/empty-import");

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

  getCardsForStatus(
    boardId: string,
    statusId: string | undefined
  ): Observable<Card[]> {
    this.statusId = statusId;
    this.boardId = boardId;

    this.statusCardsCollection = this.afs.collection<Card>(
      `boards/${boardId}/statuses/${statusId}/cards`,
      ref => ref.orderBy("order", "asc")
    );
    return (this.statusCards$ = this.statusCardsCollection
      .valueChanges({
        idField: "cardId"
      })
      .pipe(
        map(cards => {
          return cards.sort((c1, c2) => c1.order - c2.order);
        })
      ));
  }

  addCard(card: Card) {
    this.statusCardsCollection.add(card);
  }

  updateCardDescription(card: Card) {
    this.statusCardsCollection.doc(card.cardId).set(card);
  }

  updateCardsOrderWithinStatus(cardsInNewOrder: Card[]) {
    const batch = this.afs.firestore.batch();

    this.updateOrderOfCardsInFirestore(
      this.statusCardsCollection,
      cardsInNewOrder,
      batch
    );

    batch.commit();
  }

  changeCardStatus(
    previousStatusId: string,
    card: Card,
    previousStatusCollection: Card[],
    newStatusCollection: Card[]
  ) {
    let batch = this.afs.firestore.batch();

    // Update previous status
    const previousCardsCollectionRef = this.afs.collection<Card>(
      `boards/${this.boardId}/statuses/${previousStatusId}/cards`
    );

    batch.delete(previousCardsCollectionRef.doc(card.cardId).ref);

    this.updateOrderOfCardsInFirestore(
      previousCardsCollectionRef,
      previousStatusCollection,
      batch
    );

    // Update new status
    batch.set(this.statusCardsCollection.doc(card.cardId).ref, {
      ...card
    });

    this.updateOrderOfCardsInFirestore(
      this.statusCardsCollection,
      newStatusCollection,
      batch
    );

    batch.commit();
  }

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

  updateOrderOfCardsInFirestore(
    cardsCollectionRef: AngularFirestoreCollection<Card>,
    collectionWithNewOrder: Card[],
    batch: firebase.firestore.WriteBatch
  ) {
    collectionWithNewOrder.forEach((card, index) => {
      const docRef: DocumentReference = cardsCollectionRef.doc(card.cardId).ref;
      batch.update(docRef, { order: index + 1 });
    });
  }
}

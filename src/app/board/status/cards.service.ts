import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FirestoreApiService } from "src/app/core/services/firestore-api.service";
import { Card } from "./card/models/Card";

@Injectable()
export class CardsService {
  private statusCardsCollectionRef: AngularFirestoreCollection<Card>;
  private cards: Card[] = [];
  private boardId: string;

  statusCards$: Observable<Card[]>;

  constructor(
    private readonly afs: AngularFirestore,
    private readonly firestoreApiService: FirestoreApiService
  ) {}

  getCardsForStatus(
    boardId: string,
    statusId: string | undefined
  ): Observable<Card[]> {
    this.boardId = boardId;

    this.statusCardsCollectionRef = this.afs.collection<Card>(
      `boards/${boardId}/statuses/${statusId}/cards`
    );
    return (this.statusCards$ = this.statusCardsCollectionRef
      .valueChanges({
        idField: "id"
      })
      .pipe(
        map(cards => {
          const cardsCollection = cards.sort((c1, c2) => c1.order - c2.order);
          this.cards = cardsCollection;
          return cardsCollection;
        })
      ));
  }

  addCard(card: Card): void {
    this.statusCardsCollectionRef.add(card);
  }

  updateCardDescription(card: Card): void {
    this.statusCardsCollectionRef.doc(card.id).set(card);
  }

  updateCardsOrderWithinStatus(cardsInNewOrder: Card[]) {
    const batch = this.afs.firestore.batch();

    this.firestoreApiService.updateOrderOfDocumentsInCollection<Card>(
      this.statusCardsCollectionRef,
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
  ): void {
    let batch = this.afs.firestore.batch();

    // Update previous status
    const previousCardsCollectionRef = this.afs.collection<Card>(
      `boards/${this.boardId}/statuses/${previousStatusId}/cards`
    );

    batch.delete(previousCardsCollectionRef.doc(card.id).ref);

    this.firestoreApiService.updateOrderOfDocumentsInCollection<Card>(
      previousCardsCollectionRef,
      previousStatusCollection,
      batch
    );

    // Update new status
    batch.set(this.statusCardsCollectionRef.doc(card.id).ref, {
      ...card
    });

    this.firestoreApiService.updateOrderOfDocumentsInCollection<Card>(
      this.statusCardsCollectionRef,
      newStatusCollection,
      batch
    );

    batch.commit();
  }

  deleteCard(cardToDelete: Card): void {
    const filteredOutCards = this.cards.filter(card => card !== cardToDelete);

    this.firestoreApiService.deleteDocumentAndUpdateOrder(
      this.statusCardsCollectionRef,
      cardToDelete,
      filteredOutCards
    );
  }
}

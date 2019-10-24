import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  DocumentReference
} from "@angular/fire/firestore";

interface DocumentType {
  id?: string;
}

@Injectable({
  providedIn: "root"
})
export class FirestoreApiService {
  constructor() {}

  updateOrderOfDocumentsInCollection<T extends DocumentType>(
    documentCollectionRef: AngularFirestoreCollection<T>,
    collectionWithNewOrder: T[],
    batchRef: firebase.firestore.WriteBatch
  ) {
    collectionWithNewOrder.forEach((element: T, index: number) => {
      const docRef: DocumentReference = documentCollectionRef.doc(element!.id)
        .ref;
      batchRef.update(docRef, { order: index + 1 });
    });

    batchRef.commit();
  }
}

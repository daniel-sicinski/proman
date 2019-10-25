import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  DocumentReference,
  AngularFirestore
} from "@angular/fire/firestore";

interface DocumentType {
  id?: string;
}

@Injectable({
  providedIn: "root"
})
export class FirestoreApiService {
  constructor(private readonly afs: AngularFirestore) {}

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
  }

  deleteDocumentAndUpdateOrder<T extends DocumentType>(
    documentCollectionRef: AngularFirestoreCollection<T>,
    documentToDelete: T,
    filteredOutCollection: T[]
  ) {
    const batch = this.afs.firestore.batch();
    batch.delete(documentCollectionRef.doc(documentToDelete.id).ref);

    this.updateOrderOfDocumentsInCollection<T>(
      documentCollectionRef,
      filteredOutCollection,
      batch
    );

    batch.commit();
  }
}

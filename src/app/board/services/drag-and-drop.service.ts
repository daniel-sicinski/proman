import { Injectable } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { Card } from "../status/card/models/Card";
import { CardsService } from "../status/cards.service";

@Injectable()
export class DragAndDropService {
  constructor(private cardsService: CardsService) {}

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.cardsService.updateCardsOrderWithinStatus(event.container.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const previousStatusId = event.previousContainer.element.nativeElement.id;
      const cardToMove = event.container.data[event.currentIndex];

      this.cardsService.changeCardStatus(
        previousStatusId,
        cardToMove,
        event.previousContainer.data,
        event.container.data
      );
    }
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Card } from "../card/models/Card";

@Component({
  selector: "app-card-detail",
  templateUrl: "./card-detail.component.html",
  styleUrls: ["./card-detail.component.scss"]
})
export class CardDetailComponent implements OnInit {
  @Input() currentCard: Card;
  @Input() statusName: string;
  @Output() closeDisplayCardDetailState: EventEmitter<
    void
  > = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onCloseDisplayCardDetailState(e: Event) {
    if (event) {
      const clickedElement = <HTMLElement>event.target;

      const clickedOuterBound = clickedElement.classList.contains(
        "card-detail__wrapper"
      );
      if (clickedOuterBound) {
        this.closeDisplayCardDetailState.emit();
      }
    } else {
      this.closeDisplayCardDetailState.emit();
    }
  }
}

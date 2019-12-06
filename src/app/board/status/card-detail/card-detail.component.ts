import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Card } from "../card/models/Card";
import { adjustElementHeight } from "src/app/helpers/componentHelpers";

@Component({
  selector: "app-card-detail",
  templateUrl: "./card-detail.component.html",
  styleUrls: ["./card-detail.component.scss"]
})
export class CardDetailComponent {
  @Input() currentCard: Card;
  @Input() statusName: string;
  @Output() closeDisplayCardDetailState: EventEmitter<
    void
  > = new EventEmitter();

  @ViewChild("cardEditContainer", { static: false })
  cardEditContainer: ElementRef;

  ngAfterViewChecked() {
    adjustElementHeight(this.cardEditContainer, 25);
  }

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

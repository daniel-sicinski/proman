import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output,
  Renderer2
} from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CardsService } from "../cards.service";
import { Card } from "../card/models/Card";

@Component({
  selector: "app-card-edit",
  templateUrl: "./card-edit.component.html",
  styleUrls: ["./card-edit.component.scss"]
})
export class CardEditComponent implements OnInit {
  @Output() closeEditCardTitleState = new EventEmitter<void>();
  @ViewChild("cardEditContainer", { static: false })
  cardEditContainer: ElementRef;

  cardEditForm: FormGroup;

  @Input() cardPosition: ClientRect | DOMRect;
  @Input() editedCard: Card;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private cardService: CardsService
  ) {}

  ngAfterViewInit() {
    const { top, left } = this.cardPosition;

    this.renderer.setStyle(
      this.cardEditContainer.nativeElement,
      "top",
      top + "px"
    );
    this.renderer.setStyle(
      this.cardEditContainer.nativeElement,
      "left",
      left + "px"
    );
  }

  ngOnInit() {
    this.cardEditForm = this.fb.group({
      title: [this.editedCard.title, Validators.required]
    });
  }

  onCloseEditState(event?: Event) {
    if (event) {
      const clickedElement = <HTMLElement>event.target;

      const clickedOuterBound = clickedElement.classList.contains(
        "card-edit__wrapper"
      );
      if (clickedOuterBound) {
        this.closeEditCardTitleState.emit();
      }
    } else {
      this.closeEditCardTitleState.emit();
    }
  }

  onEditSubmit() {
    if (!this.cardEditForm.value.title) return;

    const updatedCard = {
      ...this.editedCard,
      title: this.cardEditForm.value.title
    };
    this.cardService.updateCardTitle(updatedCard);

    this.onCloseEditState();
  }

  onCardDelete() {
    this.cardService.deleteCard(this.editedCard);
    this.onCloseEditState();
  }
}

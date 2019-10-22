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
import { take } from "rxjs/operators";
import { Card, CardsService } from "../cards.service";

@Component({
  selector: "app-card-edit",
  templateUrl: "./card-edit.component.html",
  styleUrls: ["./card-edit.component.scss"]
})
export class CardEditComponent implements OnInit {
  @Output() closeEditState = new EventEmitter<void>();
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
      description: [this.editedCard.description, Validators.required]
    });
  }

  onCloseEditState(event?: Event) {
    if (event) {
      const clickedElement = <HTMLElement>event.target;

      const clickedOuterBound = clickedElement.classList.contains(
        "card-edit__wrapper"
      );
      if (clickedOuterBound) {
        this.closeEditState.emit();
      }
    } else {
      this.closeEditState.emit();
    }
  }

  onEditSubmit() {
    if (!this.cardEditForm.value.description) return;

    const updatedCard = {
      ...this.editedCard,
      description: this.cardEditForm.value.description
    };
    this.cardService.updateCardDescription(updatedCard);

    this.onCloseEditState();
  }
}

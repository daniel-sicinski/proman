import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import { StatusesService, Status } from "../statuses.service";
import { CardsService, Card } from "./cards.service";
import { Observable } from "rxjs";
import { Validators, FormBuilder } from "@angular/forms";
import { tap } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
  providers: [CardsService]
})
export class StatusComponent implements OnInit {
  private _status: Status;
  @Input() boardId: string;
  @Output() editStateChange = new EventEmitter<boolean>();
  cards: Card[] = [];

  @Input() set status(newValue: Status) {
    this._status = newValue;
    this.name = newValue.name;
  }

  name = "";
  isNameEditVisible = false;
  readonly editNameControl = new FormControl("");

  statusCards$: Observable<Card[]>;
  addingCardState = false;

  numberOfCards: number;

  newCardForm = this.fb.group({
    description: [null, Validators.required]
  });

  constructor(
    private statusesService: StatusesService,
    private fb: FormBuilder,
    private cardsService: CardsService
  ) {}

  ngOnInit() {
    this.cardsService
      .getCardsForStatus(this.boardId, this._status.statusId)
      .subscribe(cards => {
        this.cards = [...cards];
        this.numberOfCards = cards.length;
      });
  }

  onListDelete(): void {
    this.statusesService.deleteStatus(this._status);
  }

  showEditName(): void {
    this.editNameControl.setValue(this._status.name);
    this.isNameEditVisible = true;
  }

  focus(element: HTMLElement): void {
    setTimeout(() => element.focus(), 50);
  }

  updateName(): void {
    this.isNameEditVisible = false;
    const newName = this.editNameControl.value;

    if (!newName || newName === this._status.name) {
      return;
    }

    this.name = newName;
    this.statusesService.updateStatusName(
      this._status.statusId!,
      this.editNameControl.value
    );
  }

  onCardAdd() {
    if (!this.newCardForm.valid) return;

    const { description } = this.newCardForm.value;
    this.cardsService.addCard({ description, order: this.numberOfCards + 1 });

    this.addingCardState = false;
    this.newCardForm.reset();
  }

  trackByCards(index: number, card: Card): string | undefined {
    return card.cardId;
  }

  onCardDrop({ previousIndex, currentIndex }: CdkDragDrop<Card[]>): void {
    const cardToMove = this.cards[previousIndex];
    const cardToBeReplaced = this.cards[currentIndex];

    cardToMove.order = currentIndex + 1;
    cardToBeReplaced.order = previousIndex + 1;

    this.cards.splice(previousIndex, 1, cardToBeReplaced);
    this.cards.splice(currentIndex, 1, cardToMove);

    this.cardsService.updateCardsOrderWithinStatus(this.cards);
  }
}

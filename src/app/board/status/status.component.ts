import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef
} from "@angular/core";
import { StatusesService, Status } from "../services/statuses.service";
import { CardsService, Card } from "./cards.service";
import { Observable } from "rxjs";
import { Validators, FormBuilder } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
  providers: [CardsService]
})
export class StatusComponent implements OnInit {
  private _status: Status;
  @Input() boardId: string;
  @Input() connectedTo: (string | undefined)[];
  @Output() editStateChange = new EventEmitter<boolean>();
  cards: Card[] = [];

  @Input() set status(newValue: Status) {
    this._status = newValue;
    this.name = newValue.name;
  }

  get status() {
    return this._status;
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

  cardContainer: ElementRef;

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

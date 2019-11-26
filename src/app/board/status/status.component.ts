import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { StatusesService } from "../services/statuses.service";
import { CardsService } from "./cards.service";
import { Observable } from "rxjs";
import { Validators, FormBuilder } from "@angular/forms";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Status } from "../models/Status";
import { Card } from "./card/models/Card";
import { DragAndDropService } from "../services/drag-and-drop.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
  providers: [CardsService, DragAndDropService]
})
export class StatusComponent implements OnInit {
  private _status: Status;
  statusName: string;
  private numberOfCards: number;

  isNameEditVisible = false;
  addingCardState = false;

  statusCards$: Observable<Card[]>;

  @Input() boardId: string;
  @Input() connectedTo: (string | undefined)[];
  @Output() editStateChange = new EventEmitter<boolean>();

  @Input() set status(newValue: Status) {
    this._status = newValue;
    this.statusName = newValue.name;
  }

  get status() {
    return this._status;
  }

  newCardForm = this.fb.group({
    description: [null, Validators.required]
  });

  editNameControl = this.fb.control({
    description: [this.statusName, Validators.required]
  });

  constructor(
    private readonly statusesService: StatusesService,
    private readonly fb: FormBuilder,
    private readonly cardsService: CardsService,
    private readonly dragAndDropService: DragAndDropService
  ) {}

  ngOnInit() {
    this.statusCards$ = this.cardsService
      .getCardsForStatus(this.boardId, this._status.id)
      .pipe(tap(cards => (this.numberOfCards = cards.length)));
  }

  onStatusDelete(): void {
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

    this.statusName = newName;
    this.statusesService.updateStatusName(
      this._status.id!,
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
    return card.id;
  }

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    this.dragAndDropService.onCardDrop(event);
  }
}

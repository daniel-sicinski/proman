import { Component, OnInit, Input } from "@angular/core";
import { StatusesService, Status } from "../statuses.service";
import { CardsService, Card } from "./cards.service";
import { Observable } from "rxjs";
import { Validators, FormBuilder } from "@angular/forms";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
  providers: [CardsService]
})
export class StatusComponent implements OnInit {
  @Input() status: Status;
  @Input() boardId: string;

  statusCards$: Observable<Card[]>;
  addingCardState: false;
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
    this.cardsService.getCardsForStatus(this.boardId, this.status.statusId);

    this.statusCards$ = this.cardsService.statusCards$.pipe(
      tap(cards => {
        console.log(cards);
        this.numberOfCards = cards.length;
      })
    );
  }

  onListDelete() {
    this.statusesService.deleteStatus(this.status);
  }

  onCardAdd() {
    if (!this.newCardForm.valid) return;

    const { description } = this.newCardForm.value;
    this.cardsService.addCard({ description, order: this.numberOfCards + 1 });

    this.addingCardState = false;
    this.newCardForm.reset();
  }
}
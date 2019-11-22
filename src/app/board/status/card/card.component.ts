import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { Card } from "./models/Card";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent implements OnInit {
  @Input() currentCard: Card;
  @Output() editStateChange = new EventEmitter<boolean>();
  @ViewChild("card", { static: false })
  card: ElementRef;

  editCardTitleState: boolean;
  displayCardDetailState: boolean;
  cardPosition: ClientRect | DOMRect;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.cardPosition = this.card.nativeElement.getBoundingClientRect();
  }

  openEditCardTitleState(e: Event): void {
    e.stopPropagation();

    this.editStateChange.emit(true);
    this.editCardTitleState = true;
  }

  closeEditCardTitleState(): void {
    this.editStateChange.emit(false);
    this.editCardTitleState = false;
  }
}

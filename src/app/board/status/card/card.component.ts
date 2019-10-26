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
  cardPosition: ClientRect | DOMRect;
  @Input() currentCard: Card;
  cardEditState: boolean;
  @Output() editStateChange = new EventEmitter<boolean>();

  @ViewChild("card", { static: false })
  card: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.cardPosition = this.card.nativeElement.getBoundingClientRect();
  }

  openCardEditState(): void {
    this.editStateChange.emit(true);
    this.cardEditState = true;
  }

  closeCardEditState(): void {
    this.editStateChange.emit(false);
    this.cardEditState = false;
  }
}

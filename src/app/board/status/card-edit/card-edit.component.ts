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
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs/operators";
import { Card } from "../cards.service";

@Component({
  selector: "app-card-edit",
  templateUrl: "./card-edit.component.html",
  styleUrls: ["./card-edit.component.scss"]
})
export class CardEditComponent implements OnInit {
  @Output() closeEditState = new EventEmitter<void>();
  @ViewChild("cardEditContainer", { static: false })
  cardEditContainer: ElementRef;

  @Input() cardPosition: ClientRect | DOMRect;
  @Input() editedCard: Card;

  cardEditForm = this.fb.group({
    description: [null, Validators.required]
  });

  constructor(private fb: FormBuilder, private renderer: Renderer2) {}

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

  ngOnInit() {}

  onCloseEditState(event: Event) {
    const clickedElement = <HTMLElement>event.target;

    const clickedOuterBound = clickedElement.classList.contains(
      "card-edit__wrapper"
    );
    if (clickedOuterBound) {
      this.closeEditState.emit();
    }
  }

  onEditSubmit() {}
}

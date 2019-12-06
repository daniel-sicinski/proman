import { Component, forwardRef, EventEmitter, Input } from "@angular/core";
import { TOGGLE_BUTTON, ToggleButton } from "../../models/input-toggle-models";

@Component({
  selector: "app-text-button",
  templateUrl: "./text-button.component.html",
  styleUrls: ["./text-button.component.scss"],
  providers: [
    {
      provide: TOGGLE_BUTTON,
      useExisting: forwardRef(() => TextButtonComponent)
    }
  ]
})
export class TextButtonComponent implements ToggleButton {
  @Input() cardDescription: string;

  buttonClicked = new EventEmitter<void>();
}

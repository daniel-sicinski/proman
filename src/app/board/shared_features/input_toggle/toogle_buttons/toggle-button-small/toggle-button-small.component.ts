import { Component, EventEmitter, forwardRef } from "@angular/core";
import { ToggleButton, TOGGLE_BUTTON } from "../../models/input-toggle-models";

@Component({
  selector: "app-toggle-button-small",
  templateUrl: "./toggle-button-small.component.html",
  styleUrls: ["./toggle-button-small.component.scss"],
  providers: [
    {
      provide: TOGGLE_BUTTON,
      useExisting: forwardRef(() => ToggleButtonSmallComponent)
    }
  ]
})
export class ToggleButtonSmallComponent implements ToggleButton {
  buttonClicked = new EventEmitter<void>();
}

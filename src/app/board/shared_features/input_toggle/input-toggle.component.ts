import {
  Component,
  OnInit,
  ContentChild,
  AfterContentInit,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectorRef
} from "@angular/core";
import {
  TOGGLE_BUTTON,
  ToggleButton,
  INPUT_AREA,
  InputArea,
  INPUT_TOGGLE,
  InputToggle
} from "./models/input-toggle-models";

@Component({
  selector: "app-input-toggle",
  templateUrl: "./input-toggle.component.html",
  styleUrls: ["./input-toggle.component.scss"],
  providers: [
    {
      provide: INPUT_TOGGLE,
      useExisting: forwardRef(() => InputToggleComponent)
    }
  ]
})
export class InputToggleComponent
  implements OnInit, AfterContentInit, InputToggle {
  @Output() formSubmitted = new EventEmitter<string>();
  inputAreaOpened = false;

  @ContentChild(TOGGLE_BUTTON as any, { static: false })
  toggleButton: ToggleButton;

  @ContentChild(INPUT_AREA as any, { static: false })
  inputArea: InputArea;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  public ngAfterContentInit(): void {
    this.toggleButton.buttonClicked.subscribe(() => {
      this.inputAreaOpened = true;
    });
  }

  public onFormSubmit() {
    if (!!this.inputArea.inputValue) {
      this.formSubmitted.emit(this.inputArea.inputValue);
      this.inputArea.inputValue = "";
      this.inputAreaOpened = false;
    }
    this.cdr.detectChanges();
  }
}

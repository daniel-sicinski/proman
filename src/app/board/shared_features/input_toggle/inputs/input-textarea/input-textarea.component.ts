import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { INPUT_AREA } from "../../models/input-toggle-models";
import { adjustElementHeight } from "src/app/helpers/componentHelpers";

@Component({
  selector: "app-input-textarea",
  templateUrl: "./input-textarea.component.html",
  styleUrls: ["./input-textarea.component.scss"],
  providers: [
    {
      provide: INPUT_AREA,
      useExisting: forwardRef(() => InputTextareaComponent)
    }
  ]
})
export class InputTextareaComponent {
  @ViewChild("textarea", { static: false }) inputTextarea: ElementRef;
  @Input() placeholder: string;
  @Input() inputValue: string;

  ngAfterViewChecked() {
    adjustElementHeight(this.inputTextarea, 25);
  }
}

import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { InputArea, INPUT_AREA } from "../../models/input-toggle-models";

@Component({
  selector: "app-input-small",
  templateUrl: "./input-small.component.html",
  styleUrls: ["./input-small.component.scss"],
  providers: [
    {
      provide: INPUT_AREA,
      useExisting: forwardRef(() => InputSmallComponent)
    }
  ]
})
export class InputSmallComponent implements OnInit, InputArea {
  @Input() placeholder: string;
  inputValue = "";

  constructor() {}

  ngOnInit() {}
}

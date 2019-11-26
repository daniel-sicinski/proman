import { InjectionToken, EventEmitter } from "@angular/core";

export interface ToggleButton {
  buttonClicked: EventEmitter<void>;
}

export interface InputArea {
  placeholder: string;
  inputValue: string;
}

export interface InputToggle {
  formSubmitted: EventEmitter<string>;
  inputAreaOpened: boolean;
}

export const TOGGLE_BUTTON = new InjectionToken<ToggleButton>("ToggleButton");
export const INPUT_AREA = new InjectionToken<InputArea>("InputArea");
export const INPUT_TOGGLE = new InjectionToken<InputToggle>("InputToggle");

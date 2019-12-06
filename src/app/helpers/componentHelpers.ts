import { ElementRef } from "@angular/core";

export const adjustElementHeight = (element: ElementRef, gap: number): void => {
  element.nativeElement.style.height = "1px";
  element.nativeElement.style.height =
    gap + element.nativeElement.scrollHeight + "px";
};

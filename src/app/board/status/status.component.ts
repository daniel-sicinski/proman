import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { StatusesService, Status } from "../statuses.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
  private _status: Status;
  
  @Input() set status(newValue: Status) {
    this._status = newValue;
    this.name = newValue.name;
  }

  name = '';
  isNameEditVisible = false;
  readonly editNameControl = new FormControl('');

  constructor(private statusesService: StatusesService) {}

  onListDelete(): void {
    this.statusesService.deleteStatus(this._status);
  }

  showEditName(): void {
    this.editNameControl.setValue(this._status.name);
    this.isNameEditVisible = true;
  }

  focus(element: HTMLElement): void {
    setTimeout(() => element.focus(), 50);
  }

  updateName(): void {
    this.isNameEditVisible = false;
    const newName = this.editNameControl.value;

    if (!newName || newName === this._status.name) {
      return;
    }

    this.name = newName;
    this.statusesService.updateStatusName(this._status.statusId!, this.editNameControl.value)
  }
}

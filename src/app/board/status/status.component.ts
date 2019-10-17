import { Component, OnInit, Input } from "@angular/core";
import { StatusesService, Status } from "../statuses.service";

@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"]
})
export class StatusComponent implements OnInit {
  @Input() status: Status;

  constructor(private statusesService: StatusesService) {}

  ngOnInit() {}

  onListDelete() {
    this.statusesService.deleteStatus(this.status);
  }
}

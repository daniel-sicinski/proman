import { Component, OnInit } from "@angular/core";
import { StatusesService, Status } from "./statuses.service";
import { Observable } from "rxjs/internal/Observable";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  providers: [StatusesService]
})
export class BoardComponent implements OnInit {
  boardStatuses$: Observable<Status[]>;
  boardId: string;

  constructor(
    private statusesService: StatusesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = params["boardId"];

      this.statusesService.getStatusesOfBoard(this.boardId);

      this.boardStatuses$ = this.statusesService.boardStatuses$;
    });
  }
}

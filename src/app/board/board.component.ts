import { Component, OnInit } from "@angular/core";
import { StatusesService, Status } from "./statuses.service";
import { Observable } from "rxjs/internal/Observable";
import { ActivatedRoute, Params } from "@angular/router";
import { Validators, FormBuilder } from "@angular/forms";
import { tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  providers: [StatusesService]
})
export class BoardComponent implements OnInit {
  boardStatuses$: Observable<Status[]>;
  boardId: string;
  addingStatusState: false;
  numberOfBoardStatuses: number;

  newStatusForm = this.fb.group({
    name: [null, Validators.required]
  });

  constructor(
    private statusesService: StatusesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.boardId = params["boardId"];

      this.statusesService.getStatusesOfBoard(this.boardId);

      this.boardStatuses$ = this.statusesService.boardStatuses$.pipe(
        tap(statuses => {
          this.numberOfBoardStatuses = statuses.length;
        })
      );
    });
  }

  onStatusAdd() {
    if (!this.newStatusForm.valid) return;

    const { name } = this.newStatusForm.value;
    this.statusesService.addStatus({
      name,
      order: this.numberOfBoardStatuses + 1
    });

    this.addingStatusState = false;
    this.newStatusForm.value.name = null;
  }

  onLogOut() {
    this.authService.logOut();
  }
}

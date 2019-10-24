import { Component, OnInit, OnDestroy } from "@angular/core";
import { StatusesService } from "./services/statuses.service";
import { Observable } from "rxjs/internal/Observable";
import { ActivatedRoute, Params } from "@angular/router";
import { Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../core/services/auth.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Status } from "./models/Status";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  providers: [StatusesService]
})
export class BoardComponent implements OnInit {
  private statusesNumber: number;

  boardStatuses$: Observable<Status[]>;
  boardId: string;
  addingStatusState = false;
  cardEditState = false;

  connectedTo: (string | undefined)[] = [];

  newStatusForm = this.fb.group({
    name: [null, Validators.required]
  });

  constructor(
    private statusesService: StatusesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.boardId = params["boardId"];
      this.statusesService.getStatusesOfBoard(this.boardId);

      this.boardStatuses$ = this.statusesService.boardStatuses$.pipe(
        tap(statuses => {
          this.statusesNumber = statuses.length;
          this.connectedTo = statuses.map(status => status.id);
        })
      );
    });
  }

  onStatusAdd(): void {
    if (!this.newStatusForm.valid) return;

    const { name } = this.newStatusForm.value;
    const orderValue = this.statusesNumber + 1;
    this.statusesService.addStatus({ name, order: orderValue });

    this.addingStatusState = false;
    this.newStatusForm.reset();
  }

  trackByStatuses(index: number, status: Status): string | undefined {
    return status.id;
  }

  onLogOut(): void {
    this.authService.logOut();
  }

  onStatusDrop(event: CdkDragDrop<Status[]>): void {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.statusesService.updateStatusesOrder(event.container.data);
  }
}

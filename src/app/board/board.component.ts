import { Component, OnInit, OnDestroy } from "@angular/core";
import { StatusesService, Status } from "./statuses.service";
import { Observable } from "rxjs/internal/Observable";
import { ActivatedRoute, Params } from "@angular/router";
import { Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Subscription } from "rxjs";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  providers: [StatusesService]
})
export class BoardComponent implements OnInit, OnDestroy {
  boardStatuses: Status[] = [];
  boardStatuses$: Observable<Status[]>;
  boardId: string;
  addingStatusState: false;
  cardEditState: boolean;

  connectedTo: (string | undefined)[] = [];

  updateBoardStatusesSub: Subscription;

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

      this.updateBoardStatusesSub = this.statusesService.boardStatuses$.subscribe(
        statuses => {
          this.boardStatuses = statuses;
          this.connectedTo = statuses.map(status => status.statusId);
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.updateBoardStatusesSub.unsubscribe();
  }

  onStatusAdd() {
    if (!this.newStatusForm.valid) return;

    const { name } = this.newStatusForm.value;
    this.statusesService.addStatus({
      name,
      order: this.boardStatuses.length + 1
    });

    this.addingStatusState = false;
    this.newStatusForm.reset();
  }

  trackByStatuses(index: number, status: Status): string | undefined {
    return status.statusId;
  }

  onLogOut() {
    this.authService.logOut();
  }

  drop({ previousIndex, currentIndex }: CdkDragDrop<string[]>): void {
    if (previousIndex < currentIndex) {
      const p1 = this.boardStatuses.slice(0, previousIndex);
      const p2 = this.boardStatuses.slice(previousIndex + 1, currentIndex + 1);
      const p3 = this.boardStatuses.slice(
        currentIndex + 1,
        this.boardStatuses.length
      );
      this.boardStatuses = [
        ...p1,
        ...p2,
        this.boardStatuses[previousIndex],
        ...p3
      ].map((status, index) => ({ ...status, order: index + 1 }));
    } else {
      const p1 = this.boardStatuses.slice(0, currentIndex);
      const p2 = this.boardStatuses.slice(currentIndex, previousIndex);
      const p3 = this.boardStatuses.slice(
        previousIndex + 1,
        this.boardStatuses.length
      );
      this.boardStatuses = [
        ...p1,
        this.boardStatuses[previousIndex],
        ...p2,
        ...p3
      ].map((status, index) => ({ ...status, order: index + 1 }));
    }

    this.statusesService.updateStatusesOrder(this.boardStatuses);
    console.log("### new order", this.boardStatuses);
  }
}

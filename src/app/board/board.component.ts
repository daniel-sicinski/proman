import {
  Component,
  OnInit,
  OnDestroy,
  ContentChild,
  AfterContentInit,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { StatusesService } from "./services/statuses.service";
import { Observable } from "rxjs/internal/Observable";
import { ActivatedRoute, Params } from "@angular/router";
import { Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../core/services/auth.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Status } from "./models/Status";
import { tap } from "rxjs/operators";
import {
  INPUT_TOGGLE,
  InputToggle
} from "./shared_features/input_toggle/models/input-toggle-models";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  providers: [StatusesService]
})
export class BoardComponent implements OnInit, AfterViewInit {
  private statusesNumber: number;

  boardStatuses$: Observable<Status[]>;
  boardId: string;
  // addingStatusState = false;
  cardEditState = false;

  connectedTo: (string | undefined)[] = [];

  @ViewChild(INPUT_TOGGLE as any, { static: false })
  inputToggle: InputToggle;

  constructor(
    private statusesService: StatusesService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: Params) => {
      this.boardId = params.get("boardId");
      this.statusesService.getStatusesOfBoard(this.boardId);

      this.boardStatuses$ = this.statusesService.boardStatuses$.pipe(
        tap(statuses => {
          this.statusesNumber = statuses.length;
          this.connectedTo = statuses.map(status => status.id);
        })
      );
    });
  }

  public ngAfterViewInit(): void {
    this.inputToggle.formSubmitted.subscribe((inputValue: string) =>
      this.onStatusAdd(inputValue)
    );
  }

  onStatusAdd(inputValue: string): void {
    const orderValue = this.statusesNumber + 1;
    this.statusesService.addStatus({ name: inputValue, order: orderValue });

    // this.addingStatusState = false;
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

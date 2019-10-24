import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../core/services/auth.service";
import { BoardsService } from "../core/services/boards.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Board } from "./models/Board";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  userBoards$: Observable<Board[]>;
  addBoardModalOpened = false;

  newBoardForm = this.fb.group({
    title: [null, Validators.required]
  });

  constructor(
    private readonly authService: AuthService,
    private readonly boardsService: BoardsService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userBoards$ = this.boardsService.userBoards$;
  }

  onLogOut(): void {
    this.authService.logOut();
  }

  onNewBoardSubmit(): void {
    const { title } = this.newBoardForm.value;
    this.boardsService.addBoard(title);
    this.addBoardModalOpened = false;
    this.newBoardForm.reset();
  }
}

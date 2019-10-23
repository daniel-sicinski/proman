import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../core/services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { BoardsService, Board } from "../core/services/boards.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

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
    private readonly afs: AngularFirestore,
    private readonly boardsService: BoardsService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userBoards$ = this.boardsService.userBoards$;
  }

  onLogOut() {
    this.authService.logOut();
  }

  onNewBoardSubmit() {
    const { title } = this.newBoardForm.value;
    this.boardsService.addBoard(title);
    this.addBoardModalOpened = false;
    this.newBoardForm.value.title = null;
  }
}

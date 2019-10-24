import { NgModule } from "@angular/core";
import { BoardComponent } from "./board.component";
import { StatusComponent } from "./status/status.component";
import { CardEditComponent } from "./status/card-edit/card-edit.component";
import { CardComponent } from "./status/card/card.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import {
  redirectUnauthorizedTo,
  AngularFireAuthGuard
} from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(["auth", "logIn"]);

@NgModule({
  declarations: [
    BoardComponent,
    StatusComponent,
    CardEditComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: "",
        component: BoardComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      }
    ])
  ]
})
export class BoardModule {}

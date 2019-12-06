import { NgModule } from "@angular/core";
import { BoardComponent } from "./board.component";
import { StatusComponent } from "./status/status.component";
import { CardEditComponent } from "./status/card-edit/card-edit.component";
import { CardComponent } from "./status/card/card.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import {
  redirectUnauthorizedTo,
  AngularFireAuthGuard
} from "@angular/fire/auth-guard";
import { CardDetailComponent } from "./status/card-detail/card-detail.component";
import { InputToggleComponent } from "./shared_features/input_toggle/input-toggle.component";
import { ToggleButtonSmallComponent } from "./shared_features/input_toggle/toogle_buttons/toggle-button-small/toggle-button-small.component";
import { InputSmallComponent } from "./shared_features/input_toggle/inputs/input-small/input-small.component";
import { InputTextareaComponent } from "./shared_features/input_toggle/inputs/input-textarea/input-textarea.component";
import { TextButtonComponent } from "./shared_features/input_toggle/toogle_buttons/text-button/text-button.component";

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(["auth", "logIn"]);

@NgModule({
  declarations: [
    BoardComponent,
    StatusComponent,
    CardEditComponent,
    CardComponent,
    CardDetailComponent,
    InputToggleComponent,
    ToggleButtonSmallComponent,
    InputSmallComponent,
    InputTextareaComponent,
    TextButtonComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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

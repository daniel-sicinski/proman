import {
  redirectUnauthorizedTo,
  AngularFireAuthGuard
} from "@angular/fire/auth-guard";

import { NgModule } from "@angular/core";

import { DashboardComponent } from "./dashboard.component";

import { CommonModule } from "@angular/common";

import { ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../shared/shared.module";

import { RouterModule } from "@angular/router";

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(["auth", "logIn"]);

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: "",
        component: DashboardComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      }
    ])
  ]
})
export class DashboardModule {}

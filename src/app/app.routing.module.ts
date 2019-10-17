import { LandingPageComponent } from "./landing-page/landing-page.component";
import { Routes, RouterModule } from "@angular/router";
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo
} from "@angular/fire/auth-guard";

import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth/auth.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BoardComponent } from "./board/board.component";

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(["auth", "logIn"]);

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "auth/:authType", component: AuthComponent },
  { path: "auth/:authType", component: AuthComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: "boards/:boardId",
    component: BoardComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

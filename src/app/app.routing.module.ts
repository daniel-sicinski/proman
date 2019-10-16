import { LandingPageComponent } from "./landing-page/landing-page.component";
import { Routes, RouterModule } from "@angular/router";

import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth/auth.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "auth/:authType", component: AuthComponent },
  { path: "auth/:authType", component: AuthComponent },
  { path: "dashboard", component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

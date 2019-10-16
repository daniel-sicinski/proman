import { LandingPageComponent } from "./landing-page/landing-page.component";
import { Routes, RouterModule } from "@angular/router";

import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth/auth.component";

const routes: Routes = [
  { path: "", component: LandingPageComponent },
  { path: "auth/:authType", component: AuthComponent },
  { path: "auth/:authType", component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

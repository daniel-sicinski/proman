import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./landing-page/landing-page.module").then(
        m => m.LandingPageModule
      )
  },
  {
    path: "auth/:authType",
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: "boards/:boardId",
    loadChildren: () => import("./board/board.module").then(m => m.BoardModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

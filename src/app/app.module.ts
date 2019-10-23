import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app.routing.module";

import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { BoardComponent } from "./board/board.component";
import { StatusComponent } from "./board/status/status.component";
import { CardEditComponent } from "./board/status/card-edit/card-edit.component";
import { CardComponent } from "./board/status/card/card.component";
import { CoreModule } from "./core/core.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DashboardComponent,
    BoardComponent,
    StatusComponent,
    CardEditComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

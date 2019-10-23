import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app.routing.module";

import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { AuthComponent } from "./auth/auth.component";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material";
import { MatCardModule } from "@angular/material";
import { MatFormFieldModule } from "@angular/material";
import { MatInputModule } from "@angular/material";
import { MatButtonModule } from "@angular/material";
import { MatProgressSpinnerModule } from "@angular/material";
import { MatIconModule } from "@angular/material";
import { MatMenuModule } from "@angular/material";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BoardComponent } from "./board/board.component";
import { StatusComponent } from "./board/status/status.component";
import { CardEditComponent } from "./board/status/card-edit/card-edit.component";
import { CardComponent } from "./board/status/card/card.component";
import { CoreModule } from "./core/core.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AuthComponent,
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
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

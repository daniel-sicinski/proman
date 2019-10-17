import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app.routing.module";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
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
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { BoardComponent } from './board/board.component';
import { StatusComponent } from './board/status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AuthComponent,
    DashboardComponent,
    BoardComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AppRoutingModule
  ],
  providers: [AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}

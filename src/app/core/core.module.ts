import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import {
  MatToolbarModule,
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatMenuModule
} from "@angular/material";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AngularFireAuthGuard]
})
export class CoreModule {}

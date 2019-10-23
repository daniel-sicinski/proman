import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

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

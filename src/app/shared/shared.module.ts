import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule
  ],
  exports: [
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
    NavbarComponent
  ]
})
export class SharedModule {}

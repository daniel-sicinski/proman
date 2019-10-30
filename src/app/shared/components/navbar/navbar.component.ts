import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
  @Input() usedInComponent: "landingPage" | "auth" | "dashboard" | "board";
  @Input() loginState: boolean;
  @Output() logOutEvent = new EventEmitter<void>();

  constructor() {}

  showSignUpBtn() {
    return (
      this.usedInComponent === "landingPage" ||
      (this.usedInComponent === "auth" && this.loginState === true)
    );
  }

  showLoginBtn() {
    return (
      this.usedInComponent === "landingPage" ||
      (this.usedInComponent === "auth" && this.loginState === false)
    );
  }

  showLogoutBtn() {
    return (
      this.usedInComponent === "dashboard" || this.usedInComponent === "board"
    );
  }

  showBoardNavigation() {
    return this.usedInComponent === "board";
  }

  onLogOut() {
    this.logOutEvent.emit();
  }
}

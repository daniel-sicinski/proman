import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit, OnDestroy {
  fetchingDataFromServer = false;
  loginState = false;
  errorMessage: string | null = null;

  private readonly signUpForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    name: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(6)]]
  });

  private readonly loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  private authForm = this.signUpForm;

  readonly updateErrorMessageSub: Subscription = this.authService.authErrorMessage$.subscribe(
    errorMessage => {
      this.errorMessage = errorMessage;
      setTimeout(() => (this.errorMessage = null), 5000);
    }
  );

  readonly updateFetchingStatusSub: Subscription = this.authService.fetchingAuthData$.subscribe(
    value => (this.fetchingDataFromServer = value)
  );

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params["authType"] === "logIn") {
        this.authForm = this.loginForm;
        this.loginState = true;
      } else {
        this.authForm = this.signUpForm;
        this.loginState = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.updateErrorMessageSub.unsubscribe();
    this.updateFetchingStatusSub.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginState) {
      this.authService.logIn(this.authForm.value);
    } else {
      this.authService.signUp(this.authForm.value);
    }
  }

  logOut(): void {
    this.authService.logOut();
  }
}

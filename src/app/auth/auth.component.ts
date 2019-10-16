import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  fetchingDataFromServerState = false;
  loginState = false;

  signUpForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    name: [null, [Validators.required]],
    password: [null, Validators.required]
  });

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  authForm = this.signUpForm;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params["authType"] === "logIn") {
        this.authForm = this.loginForm;
        this.loginState = true;
      }
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }
}

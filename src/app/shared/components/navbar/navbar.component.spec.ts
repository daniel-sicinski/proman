import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NavbarComponent } from "./navbar.component";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import {
  MatToolbarModule,
  MatListModule,
  MatIconModule
} from "@angular/material";
import { AppRoutingModule } from "src/app/app.routing.module";
import { map } from "rxjs/operators";

describe("NavbarComponent", () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        AppRoutingModule
      ],
      declarations: [NavbarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("shows board navigation only on Board component", () => {
    component.usedInComponent = "board";
    fixture.detectChanges();

    const boardNavigationElement = de.query(By.css(".test-board-nav"));

    expect(boardNavigationElement.nativeElement).toBeTruthy();
  });

  it("clicking on logout button emits logout event", () => {
    component.usedInComponent = "board";
    fixture.detectChanges();

    component.logOutEvent.pipe(map(event => true)).subscribe(event => {
      expect(event).toBe(true);
    });

    const logoutLinkDe = de.query(By.css(".test-logout-link"));
    logoutLinkDe.triggerEventHandler("click", null);
  });

  describe("Auth navigation", () => {
    it("on landingPage shows only signUp and logIn links", () => {
      component.usedInComponent = "landingPage";
      fixture.detectChanges();

      const boardNavigation = de.query(By.css(".test-auth-nav"));
      const authNavElement: HTMLElement = boardNavigation.nativeElement;

      expect(authNavElement.children.length).toBe(2);
      expect(authNavElement.children).toContain(
        de.query(By.css(".test-signup-link")).nativeElement
      );
      expect(authNavElement.children).toContain(
        de.query(By.css(".test-login-link")).nativeElement
      );
      expect(de.query(By.css(".test-logout-link"))).toBeFalsy;
    });

    it("on authPage shows only signUp link in login state", () => {
      component.usedInComponent = "auth";
      component.loginState = true;
      fixture.detectChanges();

      const boardNavigation = de.query(By.css(".test-auth-nav"));
      const authNavElement: HTMLElement = boardNavigation.nativeElement;

      expect(authNavElement.children.length).toBe(1);
      expect(authNavElement.children).toContain(
        de.query(By.css(".test-signup-link")).nativeElement
      );
      expect(de.query(By.css(".test-logout-link"))).toBeFalsy;
      expect(de.query(By.css(".test-login-link"))).toBeFalsy;
    });

    it("on authPage shows only logIn link in singUp state", () => {
      component.usedInComponent = "auth";
      component.loginState = false;
      fixture.detectChanges();

      const boardNavigation = de.query(By.css(".test-auth-nav"));
      const authNavElement: HTMLElement = boardNavigation.nativeElement;

      expect(authNavElement.children.length).toBe(1);
      expect(authNavElement.children).toContain(
        de.query(By.css(".test-login-link")).nativeElement
      );
      expect(de.query(By.css(".test-logout-link"))).toBeFalsy;
      expect(de.query(By.css(".test-signup-link"))).toBeFalsy;
    });

    it("on dashboard page shows only logout link", () => {
      component.usedInComponent = "dashboard";
      fixture.detectChanges();

      const boardNavigation = de.query(By.css(".test-auth-nav"));
      const authNavElement: HTMLElement = boardNavigation.nativeElement;

      expect(authNavElement.children.length).toBe(1);
      expect(authNavElement.children).toContain(
        de.query(By.css(".test-logout-link")).nativeElement
      );
      expect(de.query(By.css(".test-signup-link"))).toBeFalsy;
      expect(de.query(By.css(".test-login-link"))).toBeFalsy;
    });

    it("on board page shows only logout link", () => {
      component.usedInComponent = "board";
      fixture.detectChanges();

      const boardNavigation = de.query(By.css(".test-auth-nav"));
      const authNavElement: HTMLElement = boardNavigation.nativeElement;

      expect(authNavElement.children.length).toBe(1);
      expect(authNavElement.children).toContain(
        de.query(By.css(".test-logout-link")).nativeElement
      );
      expect(de.query(By.css(".test-signup-link"))).toBeFalsy;
      expect(de.query(By.css(".test-login-link"))).toBeFalsy;
    });
  });
});

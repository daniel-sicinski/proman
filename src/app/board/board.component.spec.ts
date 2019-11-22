import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BoardComponent } from "./board.component";
import { StatusesService } from "./services/statuses.service";
import { ActivatedRouteStub } from "@testing/activated-route-stub";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../core/services/auth.service";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { Subject } from "rxjs";
import { Status } from "./models/Status";
import {
  click,
  dispatchInputEvent,
  dispatchSubmitEvent
} from "../../testing/testing-helpers";
import { PageHelper } from "@testing/page-helper";

@Component({ selector: "app-status", template: "" })
class StatusComponent {}

class StatusServiceStub {
  getStatusesOfBoard = jasmine.createSpy("getStatusesOfBoardSpy");

  statusSubject = new Subject<Status[]>();
  boardStatuses$ = this.statusSubject.asObservable();

  addStatus = jasmine.createSpy("addStatusStub");
  updateStatusesOrder = jasmine.createSpy("updateStatusesOrderStub");
}

describe("BoardComponent", () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let statusesService: StatusServiceStub;
  let activatedRoute: ActivatedRouteStub;
  let authService: jasmine.SpyObj<AuthService>;
  let page: Page;

  let boardId = "1";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [BoardComponent, StatusComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        FormBuilder,
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj<AuthService>("AuthService", ["logOut"])
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })

      .overrideComponent(BoardComponent, {
        set: {
          providers: [
            {
              provide: StatusesService,
              useValue: new StatusServiceStub()
            }
          ]
        }
      })

      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;

    statusesService = fixture.debugElement.injector.get(StatusesService) as any;
    activatedRoute = TestBed.get(ActivatedRoute);
    authService = TestBed.get(AuthService);
    page = new Page(fixture);

    activatedRoute.setParamMap({ boardId });

    // call ngOnInit
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getStatusesOfBoard() with current boardId onInit", () => {
    expect(statusesService.getStatusesOfBoard).toHaveBeenCalledWith("1");
  });

  it("should display statuses onInit", () => {
    const dummyStatuses = [
      statusFactory("status1", 1, "1"),
      statusFactory("status2", 2, "2"),
      statusFactory("status3", 3, "3")
    ];

    statusesService.statusSubject.next(dummyStatuses);
    fixture.detectChanges();

    expect(page.statuses.length).toBe(3);
  });

  it("should update connectedTo array with status ids", () => {
    const dummyStatuses = [
      statusFactory("status1", 1, "1"),
      statusFactory("status2", 2, "2"),
      statusFactory("status3", 3, "3")
    ];

    statusesService.statusSubject.next(dummyStatuses);

    expect(component.connectedTo).toEqual(["1", "2", "3"]);
  });

  it("calling onLogOut() should call logOut() method from AuthService", () => {
    component.onLogOut();

    expect(authService.logOut).toHaveBeenCalledTimes(1);
  });

  describe("Adding new status", () => {
    it("displays new status modal on btn click", () => {
      click(page.addNewBoardBtn);

      fixture.detectChanges();

      expect(page.newStatusModal).toBeDefined();
      expect(page.newStatusModal).not.toBeNull();
    });
  });

  it("submitting a new status data calls addStatus() from StatusesService", () => {
    const newBoardTitle = "test";
    component["statusesNumber"] = 1;

    component.addingStatusState = true;

    fixture.detectChanges();

    page.newStatusInput.value = newBoardTitle;
    dispatchInputEvent(page.newStatusInput);

    dispatchSubmitEvent(page.newStatusForm);

    expect(statusesService.addStatus).toHaveBeenCalledTimes(1);
    expect(statusesService.addStatus).toHaveBeenCalledWith({
      name: newBoardTitle,
      order: 2
    });
  });

  it("After adding new status modal is closed and the form resets", () => {
    component.onStatusAdd();

    fixture.detectChanges();

    expect(page.newStatusModal).toBeNull();
    expect(component.newStatusForm.value.name).toBeNull();
  });
});

class Page extends PageHelper<BoardComponent> {
  get addNewBoardBtn() {
    return this.query<HTMLSpanElement>(".test-add-status-panel");
  }
  get statuses() {
    return this.queryAll<HTMLElement>(".test-app-status");
  }

  get newStatusModal() {
    return this.query<HTMLDivElement>(".test-new-status-modal");
  }

  get newStatusForm() {
    return this.query<HTMLFormElement>(".test-new-status-modal form");
  }

  get newStatusInput() {
    return this.query<HTMLInputElement>(".test-new-status-modal input");
  }

  constructor(public fixture: ComponentFixture<BoardComponent>) {
    super(fixture);
  }
}

function statusFactory(name: string, order: number, id: string): Status {
  return {
    name,
    order,
    id
  };
}

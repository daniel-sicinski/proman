import { Component, OnInit, Input } from "@angular/core";
import { Card } from "../card/models/Card";

@Component({
  selector: "app-card-detail",
  templateUrl: "./card-detail.component.html",
  styleUrls: ["./card-detail.component.scss"]
})
export class CardDetailComponent implements OnInit {
  @Input() editedCard: Card;

  constructor() {}

  ngOnInit() {}
}

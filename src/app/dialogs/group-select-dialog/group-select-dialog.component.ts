import { Component, ViewEncapsulation } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-group-select-dialog",
  standalone: false,
  templateUrl: "./group-select-dialog.component.html",
  styleUrl: "./group-select-dialog.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class GroupSelectDialogComponent {
  constructor(private ref: DynamicDialogRef) {}
  groupOptions = [
    { id: 1, label: "Hike", emoji: "🥾" },
    { id: 2, label: "Hike’n’Run", emoji: "🥾 🏃" },
    { id: 3, label: "Hike’n’Run’n’Bike", emoji: "🥾 🏃 🚴" },
  ];

  selectedGroup: number | null = null;

  chooseGroup(group: number) {
    this.ref.close(group);
  }
}

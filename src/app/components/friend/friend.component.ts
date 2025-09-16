import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { Participant } from "../../interfaces/participant";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "um-friend",
  standalone: true,
  templateUrl: "./friend.component.html",
  styleUrls: ["./friend.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, NgOptimizedImage],
})
export class FriendComponent implements OnChanges {
  @Input() friend?: Participant;
  @Input() pinned = false;

  displayName = "";
  avatarUrl = "";

  goalKm = 0;
  doneKm = 0;
  percent = 0;

  remainingKm = 0;
  overByKm = 0;

  dailyMeanKm = 0;
  meanToGoKm = 0;

  ariaNow = 0;
  ariaText = "0%";
  dailyAvgAria = "";
  statusClass = "";
  dailyAvgClass = "";

  expanded = false;
  detailsId = "friend-details";

  constructor(private utils: UtilsService) {}

  ngOnChanges(_: SimpleChanges): void {
    const f: any = this.friend ?? {};

    this.displayName = (f.name ?? "").trim() || "Unbekannt";
    this.avatarUrl = (f.image ?? "").trim();

    const goal = Math.max(0, Number(f.gemeldet ?? 0));
    const done = Math.max(0, Number(f.bereitsZurueckgelegt ?? 0));

    this.goalKm = goal;
    this.doneKm = done;

    const rawPercent = goal > 0 ? (done / goal) * 100 : 0;
    this.percent = rawPercent;

    const remaining = goal - done;
    this.remainingKm = remaining;
    this.overByKm = remaining < 0 ? -remaining : 0;

    const footAvg = Number(f.tagesdurchschnitt ?? 0);
    const bikeAvg = Number(f.tagesdurchschnittRad ?? 0);
    this.dailyMeanKm = footAvg + bikeAvg;
    const meanRaw = Number(this.utils?.calculateMeanToGo?.(f) ?? 0);
    this.meanToGoKm = Number.isFinite(meanRaw) ? Math.max(0, meanRaw) : 0;

    this.ariaNow = this.clamp(Math.round(this.percent), 0, 100);
    this.ariaText = `${this.ariaNow}%`;

    this.statusClass = this.computeStatusClass(this.percent);
    this.dailyAvgClass = this.computeDailyAvgClass(
      this.meanToGoKm,
      this.percent
    );
    this.dailyAvgAria =
      `Nötiger Tagesdurchschnitt, um das Ziel zu erreichen: ` +
      `${this.meanToGoKm.toFixed(2)} Kilometer pro Tag.`;

    const base =
      (this.displayName || "friend")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "friend";
    this.detailsId = `friend-details-${base}`;
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }

  private clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
  }

  private computeStatusClass(percent: number): string {
    if (percent >= 100) return "is-blue";
    if (percent >= 80) return "is-green";
    if (percent >= 30) return "is-amber";
    return "is-rose";
  }

  private computeDailyAvgClass(meanToGoKm: number, percent: number): string {
    if (percent >= 100) return "is-blue";
    if (meanToGoKm <= 2) return "is-green";
    if (meanToGoKm <= 5) return "is-amber";
    return "is-rose";
  }
}

import { Component, Input } from "@angular/core";
import { Participant } from "../../interfaces/participant";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "um-friend",
  standalone: false,
  templateUrl: "./friend.component.html",
  styleUrl: "./friend.component.scss",
})
export class FriendComponent {
  @Input("friend") friend: Participant | undefined;
  progress: number = 0;

  constructor(protected utils: UtilsService) {}

  pct(r: any): number {
    const v = (Number(r?.bereitsZurueckgelegt) / Number(r?.gemeldet)) * 100;
    return Number.isFinite(v) ? v : 0;
  }
  remaining(r: any): number {
    const v = Number(r?.gemeldet) - Number(r?.bereitsZurueckgelegt);
    return v;
  }
  realDaily(friend: any): number {
    const run = Number(friend?.tagesdurchschnitt) || 0;
    const bike = Number(friend?.tagesdurchschnittRad) || 0;
    return run + bike;
  }

  /**
   * Liefert den Soll-Tagesdurchschnitt.
   * Falls dein Datenmodell bereits friend.sollTagesdurchschnitt o.ä. hat,
   * wird dieser Wert genutzt. Sonst Fallback: 0 (neutral).
   * -> Passe diese Funktion gern an eure interne Logik an.
   */
  targetDaily(friend: any): number {
    const direct = Number(
      friend?.sollTagesdurchschnitt ??
        friend?.zielTagesdurchschnitt ??
        friend?.soll ??
        friend?.targetDaily
    );
    return isNaN(direct) ? 0 : direct;
  }

  /** A11y-Label für den Vergleichs-Badge */
  dailyAvgAria(friend: any): string {
    const real = this.realDaily(friend);
    const target = this.targetDaily(friend);
    const diff = target - real;

    let status = "";
    if (real > target) status = "über Soll";
    else if (diff > 2) status = "deutlich unter Soll";
    else if (diff > 0) status = "leicht unter Soll";
    else status = "im Rahmen";

    return (
      `Realer Tagesdurchschnitt ${real.toFixed(2)} Kilometer pro Tag, ` +
      `Soll ${target.toFixed(2)}. Status: ${status}.`
    );
  }

  dailyAvgClass(friend: any): string {
    const real = this.realDaily(friend);
    const diff = this.utils.calculateMeanToGo(friend) - real;

    if (real > this.utils.calculateMeanToGo(friend))
      return "foot__avg is-green"; // über Soll => grün
    if (diff > 2) return "foot__avg is-rose"; // mehr als 2 km darunter => rot
    return "foot__avg is-amber"; // sonst => orange
  }

  ngOnInit() {
    this.progress =
      Math.round(
        (100 / this.friend?.gemeldet!) *
          this.friend?.bereitsZurueckgelegt! *
          100
      ) / 100;
    console.log(this.friend);
  }
}

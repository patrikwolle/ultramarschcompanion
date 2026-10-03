import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Participant } from "../../interfaces/participant";

interface PathMarker {
  friend: Participant;
  x: number;
  y: number;
  percent: number;
}

interface Checkpoint {
  percent: number;
  x: number;
  y: number;
}

@Component({
  selector: "um-progress-path",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./progress-path.component.html",
  styleUrls: ["./progress-path.component.scss"],
})
export class ProgressPathComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() friends: Participant[] = [];

  @ViewChild("trail") trailRef!: ElementRef<SVGPathElement>;
  @ViewChild("host", { static: true }) hostRef!: ElementRef<HTMLElement>;
  @ViewChild("scene", { static: true }) sceneRef!: ElementRef<HTMLElement>;

  markers: PathMarker[] = [];
  checkpoints: Checkpoint[] = [];

  private viewReady = false;
  private resizeObserver?: ResizeObserver;
  private lastKnownWidth = 0;
  readonly checkpointPercents = [0, 25, 50, 75, 100];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.viewReady = true;

    // Renderer2.setStyle umgeht Angulars Style-Binding/Sanitizing-Pipeline
    // komplett und setzt den Wert direkt und zuverlässig auf dem Element.
    // document.baseURI kennt automatisch den aktuellen Deploy-Pfad
    // (Domain-Root ODER Unterordner wie /ultramarschcompanion/).
    const url = `${document.baseURI}/images/q2_background.jpg`;
    this.renderer.setStyle(
      this.sceneRef.nativeElement,
      "background-image",
      `url("${url}")`
    );

    // setTimeout schiebt den ersten recompute()-Aufruf in den nächsten
    // Change-Detection-Zyklus (verhindert NG0100).
    setTimeout(() => this.recompute());

    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width ?? 0;
      if (width > 0 && width !== this.lastKnownWidth) {
        this.lastKnownWidth = width;
        this.recompute();
      }
    });
    this.resizeObserver.observe(this.hostRef.nativeElement);
  }

  ngOnChanges(_: SimpleChanges): void {
    if (this.viewReady) {
      this.recompute();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private recompute(): void {
    const path = this.trailRef?.nativeElement;
    if (!path || path.getTotalLength() === 0) {
      return;
    }
    this.computeCheckpoints();
    this.computeMarkers();
  }

  trackByName = (_: number, m: PathMarker) => m.friend.name!;

  private pct(f: Participant): number {
    const goal = Number((f as any)?.gemeldet ?? 0);
    const done = Number((f as any)?.bereitsZurueckgelegt ?? 0);
    if (!(goal > 0)) return 0;
    return Math.max(0, Math.min(100, (done / goal) * 100));
  }

  private pointAt(percent: number): { x: number; y: number } {
    const path = this.trailRef?.nativeElement;
    if (!path) return { x: 0, y: 0 };
    const len = path.getTotalLength();
    const clamped = Math.max(0, Math.min(100, percent));
    const p = path.getPointAtLength((clamped / 100) * len);
    return { x: p.x, y: p.y };
  }

  private tangentAt(percent: number): { x: number; y: number } {
    const path = this.trailRef?.nativeElement;
    if (!path) return { x: 1, y: 0 };
    const len = path.getTotalLength();
    const clamped = Math.max(0, Math.min(100, percent));
    const d = 0.5;
    const at = (clamped / 100) * len;
    const p1 = path.getPointAtLength(Math.max(0, at - d));
    const p2 = path.getPointAtLength(Math.min(len, at + d));
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.hypot(dx, dy) || 1;
    return { x: dx / mag, y: dy / mag };
  }

  private computeCheckpoints(): void {
    this.checkpoints = this.checkpointPercents.map((percent) => ({
      percent,
      ...this.pointAt(percent),
    }));
  }

  private computeMarkers(): void {
    const grouped = new Map<number, Participant[]>();

    this.friends.forEach((f) => {
      const percent = Math.round(this.pct(f));
      const bucket = grouped.get(percent) ?? [];
      bucket.push(f);
      grouped.set(percent, bucket);
    });

    const markers: PathMarker[] = [];

    grouped.forEach((group, roundedPercent) => {
      const base = this.pointAt(roundedPercent);
      const tangent = this.tangentAt(roundedPercent);
      const normal = { x: -tangent.y, y: tangent.x };
      const spread = 16;

      group.forEach((f, i) => {
        const offset = (i - (group.length - 1) / 2) * spread;
        markers.push({
          friend: f,
          x: base.x + normal.x * offset,
          y: base.y + normal.y * offset,
          percent: this.pct(f),
        });
      });
    });

    this.markers = markers.sort((a, b) => b.percent - a.percent);
  }
}
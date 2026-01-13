import { Component, OnInit, OnDestroy } from "@angular/core";
import { MenuItem } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UploadDialogComponent } from "../../dialogs/upload-dialog/upload-dialog.component";
import { UploadedFilesComponent } from "../../dialogs/uploaded-files/uploaded-files.component";
import {AllParticipant, Participant} from "../../interfaces/participant";
import { BaseMessage } from "../../interfaces/processed-messages";
import { DbService } from "../../services/db.service";
import { DomParserService } from "../../services/dom-parser.service";
import { LocalStorageService } from "../../services/local-storage.service";
import { UmServiceService } from "../../services/um-service.service";
import { UtilsService } from "../../services/utils.service";

type SortKey = "name" | "progress" | "done";
type SelfMode = "pin" | "include";

@Component({
  selector: "um-main",
  standalone: false,
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],

  providers: [DialogService],
})
export class MainComponent implements OnInit, OnDestroy {
  pinnedFriendId: string | null = null;
  addError = "";

  isLoading = true;
  isLoadingAll = true;
  activeTab: string = "progress";
  sheetOpen = false;

  private destroy$ = new Subject<void>();

  sortKey: SortKey = "name";
  asc = true;
  selfMode: SelfMode = "pin";

  selectUserId: string | undefined;
  selectedUser: Participant | undefined;
  selectedUserGroup = "";
  friendId = "";
  friends: Participant[] = [];

  history: BaseMessage[] | undefined = undefined;
  showHistory = false;

  ref: DynamicDialogRef | undefined;
  menuItems: MenuItem[] = [{ label: "Settings" }, { label: "Upload" }];

  quartale = [{ name: "q1", start: new Date(20) }];

  allUsers: AllParticipant = {
    hike: [],
    hikeRun: [],
    hikeRunBike: []}
  progress = 0;

  groupOptions: Array<{ name: string; value: number }> = [
    { name: "Wandern", value: 1 },
    { name: "Wandern und Laufen", value: 2 },
    { name: "Wandern, Laufen und Rad", value: 3 },
  ];

  selectedGroup = 0;
  token = "";

  constructor(
    private umService: UmServiceService,
    private dP: DomParserService,
    private database: DbService,
    private lS: LocalStorageService,
    public dialogService: DialogService,
    protected utils: UtilsService
  ) {}

  fabItems = [
    {
      label: "Upload",
      icon: "pi pi-upload",
      command: () => this.openUploadDialog(),
    },
    {
      label: "Übersicht",
      icon: "pi pi-list",
      command: () => this.openUploadedFilesDialog(),
    },
  ];

  ngOnInit(): void {
    const sk = localStorage.getItem('sortKey');
    this.asc = localStorage.getItem('asc') === 'true';
    if(sk !== null) {
      switch (sk) {
        case 'name':
          this.sortKey = 'name'
          break;
        case 'done':
          this.sortKey = 'done'
          break;
        case 'progress':
          this.sortKey = 'progress'
          break
      }
    }
    this.pinnedFriendId = this.lS.getPinnedFriend();

    this.token = this.lS.getToken();
    if (this.token) {
      this.umService.getProcessedMessages(this.token)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.history = this.dP.extractMessages(res);
        });
    }

    const storedCat = this.lS.getCategory();
    this.selectedUserGroup = typeof storedCat === "string" ? storedCat : "";
    this.selectedGroup =
      this.groupOptions.find((g) => g.name === this.selectedUserGroup)?.value ||
      0;

    this.selectUserId = this.lS.getUser() ?? undefined;

    this.database.getParticipantsHike().then((participants) => {
      this.allUsers.hike = participants;
      this.database.getParticipantsHikeRun().then((participants2) => {
        this.allUsers.hikeRun = participants2;
        this.database.getParticipantsHikeRunBike().then((participants3) => {
          this.allUsers.hikeRunBike = participants3;
          if (this.selectUserId)
            this.selectedUser = this.findUser(this.selectUserId);
          this.isLoadingAll = false;
          this.lS.getFriends().forEach((friendId) => this.addFriend(friendId));
          this.getData();
        });
      });
    });
  }

  private norm(name?: string): string {
    return (name ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private kmDone(r?: Participant): number {
    const v = Number(r?.bereitsZurueckgelegt ?? 0);
    return Number.isFinite(v) ? Math.max(0, v) : 0;
  }

  private kmGoal(r?: Participant): number {
    const v = Number(r?.gemeldet ?? 0);
    return Number.isFinite(v) && v > 0 ? v : 0;
  }

  private beginLoading() {
    this.allUsers.hike.forEach((h) => h.loading = true);
    this.allUsers.hikeRun.forEach((h) => h.loading = true);
    this.allUsers.hikeRunBike.forEach((h) => h.loading = true);
    this.lS
      .getFriends()
      .forEach((friendId) => this.updateFriend(friendId));
  }

  private pctOf(r?: Participant): number {
    const g = this.kmGoal(r);
    return g > 0 ? (this.kmDone(r) / g) * 100 : 0;
  }

  private pinByName(list: Participant[], name: string): Participant[] {
    const key = this.norm(name);
    const pinned = list.find((p) => this.norm(p.name) === key);
    if (!pinned) return list;
    const others = list.filter((p) => this.norm(p.name) !== key);
    return [pinned, ...others];
  }

  pct(r?: Participant): number {
    return this.pctOf(r);
  }

  remaining(r?: Participant): number {
    const g = this.kmGoal(r);
    const d = this.kmDone(r);
    return Math.max(0, g - d);
  }

  sortArray(arr: Participant[]): Participant[] {
    const base = [...arr];

    const byName = (a: Participant, b: Participant) =>
      (a.name || "").localeCompare(b.name || "", undefined, {
        sensitivity: "base",
      });

    const byProgress = (a: Participant, b: Participant) =>
      this.pctOf(a) - this.pctOf(b); // -> ascending

    const byDone = (a: Participant, b: Participant) =>
      this.kmDone(a) - this.kmDone(b); // -> descending

    const primary =
      this.sortKey === "name"
        ? byName
        : this.sortKey === "progress"
        ? byProgress
        : byDone;

    const sorted = base.sort((a, b) => {
      const d = primary(a, b);
      return d !== 0 ? d : byName(a, b);
    });

    return this.asc ? sorted : sorted.reverse();
  }

  setSortKey(key: SortKey): void {
    localStorage.setItem('sortKey', key)
    localStorage.setItem('asc', String(this.asc))
    if (this.sortKey === key) {
      this.asc = !this.asc;
    } else {
      this.sortKey = key;
      this.asc = key === "name";
    }
  }

  toggleAsc(): void {
    this.asc = !this.asc;
  }

  distinctByName(arr: Participant[]): Participant[] {
    const map = new Map<string, Participant>();
    for (const p of arr) {
      const k = this.norm(p.name);
      if (!map.has(k)) map.set(k, p);
    }
    return Array.from(map.values());
  }

  get renderFriends(): Participant[] {
    let list = this.distinctByName(this.friends);
    list = this.sortArray(list);

    if (this.selfMode === "include" && this.selectedUser) {
      list = this.distinctByName([...list, this.selectedUser]);
      list = this.sortArray(list);
    }
    if (this.selfMode === "pin" && this.selectedUser) {
      list = this.pinByName(list, this.selectedUser.name!);
    }

    if (this.pinnedFriendId) {
      list = this.pinByName(list, this.pinnedFriendId);
    }

    return list;
  }

  togglePin(p: Participant): void {
    const id = (p?.name ?? "").trim();
    if (!id) return;
    if (this.isPinned(p)) {
      this.pinnedFriendId = null;
      this.lS.clearPinnedFriend();
    } else {
      this.pinnedFriendId = id;
      this.lS.setPinnedFriend(id);
    }
  }

  isPinned(p: Participant): boolean {
    return (
      !!p?.name &&
      this.pinnedFriendId !== null &&
      this.norm(p.name) === this.norm(this.pinnedFriendId)
    );
  }

  addFriend(friendId?: string): void {
    const id = (friendId ?? this.friendId ?? "").trim();
    if (!id) return;

    const friend = this.findUser(id);
    if (!friend) {
      this.friendId = "";
      return;
    }

    const needle = this.norm(friend.name);
    const exists = this.friends.some((f) => this.norm(f.name) === needle);
    if (!exists) {
      this.friends.push(friend);
      this.lS.addFriend(id);
    }
    this.friendId = "";
  }

  updateFriend(friendId: string): void {
    const friend = this.findUser(friendId);
    if (friend) {
      this.friends = this.friends.map((f) =>
        this.norm(f.name) === this.norm(friendId) ? friend : f
      );
    }
  }

  confirmRemove(p: Participant): void {
    const id = (p?.name ?? "").trim();
    if (!id) return;
    const ok = window.confirm(`"${id}" aus deiner Liste entfernen?`);
    if (ok) this.removeFriend(id);
  }

  removeFriend(friendId: string): void {
    const key = this.norm(friendId);
    if (this.pinnedFriendId && this.norm(this.pinnedFriendId) === key) {
      this.pinnedFriendId = null;
      this.lS.clearPinnedFriend();
    }
    this.friends = this.friends.filter((f) => this.norm(f.name) !== key);
    this.lS.removeFriend(friendId);
  }

  selectUser(userId: string | undefined): void {
    if (!userId) return;
    this.lS.addUser(userId);
    this.selectedUser = this.findUser(userId);

    const g = this.kmGoal(this.selectedUser);
    const d = this.kmDone(this.selectedUser);
    this.progress = Math.round((g > 0 ? (100 / g) * d : 0) * 100) / 100;
  }

  findUser(userId: string): Participant | undefined {
    const HikeUser = this.allUsers.hike.find((u) => u.name === userId);
    const HikeRunUser = this.allUsers.hikeRun.find((u) => u.name === userId);
    const HikeRunBikeUser = this.allUsers.hikeRunBike.find(
      (u) => u.name === userId
    );
    if (HikeUser) {
      this.selectedUserGroup = "Wandern";
      return HikeUser;
    } else if (HikeRunUser) {
      this.selectedUserGroup = "Wandern und Laufen";
      return HikeRunUser;
    } else if (HikeRunBikeUser) {
      this.selectedUserGroup = "Wandern, Laufen und Radfahren";
      return HikeRunBikeUser;
    }
    return undefined;
  }

  getData(): void {
    this.beginLoading();
    this.umService.getQuartalDataHike()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.allUsers.hike = this.dP.convertHtmlToObject(response);
        this.allUsers.hike.forEach((h) => {h.loading = false;h.type='hike'});
        this.umService.getQuartalDataHikeRun()
          .pipe(takeUntil(this.destroy$))
          .subscribe((response1) => {
            this.allUsers.hikeRun = this.dP.convertHtmlToObject(response1);
            this.allUsers.hikeRun.forEach((h) => {h.loading = false;h.type='hikeRun'});
            this.database.addParticipantHike(this.allUsers.hike).then(() => {});
            this.database
              .addParticipantHikeRun(this.allUsers.hikeRun)
              .then(() => {});
            this.umService.getQuartalDataHikeRunBike()
              .pipe(takeUntil(this.destroy$))
              .subscribe((response2) => {
                this.allUsers.hikeRunBike = this.dP.convertRadHtmlToObject(response2);
                this.allUsers.hikeRunBike.forEach((h) => {h.loading = false;h.type='hikeRunBike'});
                this.database
                  .addParticipantHikeRunBike(this.allUsers.hikeRunBike)
                  .then(() => {
                    this.lS
                      .getFriends()
                      .forEach((friendId) => this.updateFriend(friendId));
                  });
              });
          });
      });
  }

  trackByName = (_: number, p: Participant) => p.name!;

  openUploadDialog() {
    if (this.ref) {
      this.ref.close();
    }
    this.ref = this.dialogService.open(UploadDialogComponent, {
      header: "Aktivität hinzufügen",
      width: "520px",
      modal: true,
      dismissableMask: true,
      closable: true,
      contentStyle: { overflow: "auto" },
      breakpoints: {
        "960px": "520px",
        "640px": "92vw",
      },
      styleClass: "upload-dialog",
    });
    this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.token) {
          this.umService.getProcessedMessages(this.token)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.history = this.dP.extractMessages(res);
            });
        }
      });
  }

  openUploadedFilesDialog() {
    this.umService.getProcessedMessages(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const processedFiles = this.dP.extractMessages(res);

        this.ref = this.dialogService.open(UploadedFilesComponent, {
          header: "Hochgeladene Strecken",
          width: "520px",
          modal: true,
          dismissableMask: true,
          closable: true,
          contentStyle: { overflow: "auto" },
          breakpoints: {
            "960px": "520px",
            "640px": "92vw",
          },
          data: {
            files: processedFiles,
          },
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.ref) {
      this.ref.close();
    }
  }
}

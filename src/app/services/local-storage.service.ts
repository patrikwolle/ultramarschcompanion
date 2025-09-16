import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LocalStorageService {
  constructor() {}

  // ---------- kleine Helfer ----------
  private readList(key: string): string[] {
    const raw = localStorage.getItem(key) || "";
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private writeList(key: string, arr: string[]): void {
    const unique = Array.from(
      new Set(arr.map((s) => s.trim()).filter(Boolean))
    );
    localStorage.setItem(key, unique.join(","));
  }

  // ---------- Category ----------
  addCatergory(category: string) {
    // (bestehender Name bleibt)
    localStorage.setItem("category", category);
  }
  // optional: korrekter Alias
  addCategory(category: string) {
    this.addCategory(category);
  }
  getCategory() {
    return localStorage.getItem("category");
  }
  clearCategory() {
    localStorage.removeItem("category");
  }

  // ---------- User ----------
  addUser(user: string) {
    localStorage.setItem("user", user);
  }
  getUser() {
    return localStorage.getItem("user");
  }
  clearUser() {
    localStorage.removeItem("user");
  }

  // ---------- Token ----------
  addToken(token: string) {
    localStorage.setItem("userToken", token);
  }
  getToken(): string {
    return localStorage.getItem("userToken") ?? "";
  }
  clearToken() {
    localStorage.removeItem("userToken");
  }

  // ---------- Friends (Komma-Liste beibehalten) ----------
  async addFriend(friend: string) {
    const friends = this.readList("friends");
    if (!friends.includes(friend)) {
      friends.push(friend);
      this.writeList("friends", friends);
    }
  }
  getFriends(): string[] {
    return this.readList("friends");
  }
  removeFriend(friend: string) {
    const friends = this.readList("friends").filter((f) => f !== friend);
    this.writeList("friends", friends);
  }
  clearFriends() {
    localStorage.removeItem("friends");
  }

  // ---------- Pinned Friend (NEU) ----------

  getPinnedFriend(): string | null {
    try {
      const v = localStorage.getItem("um.pinnedFriend");
      return v && v.trim() ? v.trim() : null;
    } catch {
      return null;
    }
  }
  setPinnedFriend(name: string): void {
    try {
      localStorage.setItem("um.pinnedFriend", (name ?? "").trim());
    } catch {}
  }
  clearPinnedFriend(): void {
    try {
      localStorage.removeItem("um.pinnedFriend");
    } catch {}
  }
}
